import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Stripe } from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class StripeService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripeClient: Stripe, // Use stripeClient instead of `stripe`
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Create a Stripe checkout session for purchasing credits.
   */
  async createCheckoutSession(
    userId: string,
    credits: number,
    amount: number,
  ): Promise<Stripe.Checkout.Session> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error('User not found');

    return this.stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${credits} Credits Package`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
  }

  /**
   * Verify and construct the Stripe event using the raw body and signature.
   */
  constructEvent(
    rawBody: Buffer,
    sig: string,
    webhookSecret: string,
  ): Stripe.Event {
    try {
      return this.stripeClient.webhooks.constructEvent(
        rawBody,
        sig,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${err.message}`,
      );
    }
  }

  /**
   * Handle the verified Stripe webhook event to update user credits.
   */
  async handleStripeWebhook(event: Stripe.Event) {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email;
      const user = await this.userModel.findOne({ email });

      if (!user) throw new Error(`User with email ${email} not found`);

      // Calculate credits from session amount
      //   const credits = Number(session.amount_total) / 500;
      let amount = Number(session.amount_total);

      // Apply the bonus logic based on credit amount
      let totalCreditsToAdd = amount;
      //   console.log('Credits:', amount);

      //   percentage logic moved in controller (better because permits us to have correct number of the tokens which is diffrent of price in case of discount)
      if (amount <= 10000) {
        totalCreditsToAdd = amount; // If less than 10000, no change
      } else if (amount > 10000 && amount < 50000) {
        totalCreditsToAdd = amount * 1.2; // Add 20%
      } else if (amount >= 50000) {
        totalCreditsToAdd = amount * 1.3; // Add 30%
      }

      // Update user's credits
      user.credits += totalCreditsToAdd / 10;
      await user.save();

      //   console.log(`User ${user.email} credits updated. New balance: ${user.credits}`);
    }
  }
}
