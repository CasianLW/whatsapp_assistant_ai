import {
  Controller,
  Post,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UserRequest } from 'src/auth/interfaces/user-request.interface';
import { convertCredits } from 'src/helpers/to-number-credit';

@Controller('stripe')
export class StripeController {
  constructor(public readonly stripeService: StripeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-session/:credits')
  async createCheckoutSession(
    @Param('credits') credits: number,
    @Req() req: UserRequest,
  ) {
    const userId = req.user.userId; // Access userId from the custom user object
    let amount: number;
    let creditsNumber;
    creditsNumber = convertCredits(credits);
    // switch (creditsNumber) {
    //   case 100:
    //     amount = 1000; // $10.00
    //     break;
    //   case 1000:
    //     amount = 8000; // $80.00
    //     break;
    //   case 5000:
    //     amount = 35000; // $350.00
    //     break;
    //   default:
    //     throw new BadRequestException('Invalid credit package');
    // }
    let finalCredits: number; // Define a variable to store the final calculated credits

    // Validate and calculate the Stripe amount based on credits
    if (creditsNumber < 50) {
      throw new BadRequestException(
        'Invalid credit package. Minimum 50 credits required.',
      );
    } else {
      amount = creditsNumber * 10; // Calculate amount in cents (e.g., 100 credits = 1000 cents or 10€)
    }

    // Apply bonus logic based on the number of credits
    if (creditsNumber <= 1000) {
      finalCredits = creditsNumber; // Exact amount for up to 1000 credits
    } else if (creditsNumber > 1000 && creditsNumber < 5000) {
      finalCredits = creditsNumber + creditsNumber * 0.2; // Add 20% for credits between 1000 and 5000
    } else if (creditsNumber >= 5000) {
      finalCredits = creditsNumber + creditsNumber * 0.3; // Add 30% for credits above 5000
    } else {
      throw new BadRequestException('Invalid credit package');
    }

    return this.stripeService.createCheckoutSession(
      userId,
      finalCredits,
      amount,
    );
    // return this.stripeService.createCheckoutSession(userId, credits, amount);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: Request) {
    // Ensure that the signature is a string and not an array of strings
    const sig = Array.isArray(req.headers['stripe-signature'])
      ? req.headers['stripe-signature'][0]
      : req.headers['stripe-signature']; // Type guard to extract a single string

    const rawBody = req.rawBody;

    try {
      // Use the service's method to construct and verify the Stripe event
      const event = this.stripeService.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
      await this.stripeService.handleStripeWebhook(event);
      return { received: true };
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      throw new BadRequestException('Webhook error');
    }
  }
}
