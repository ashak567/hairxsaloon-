import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Service from '@/lib/models/Service';

const allServices = [
  // MEN HAIR SERVICES
  { name: 'Haircut', category: 'Hair', genderCategory: 'Male', priceRange: '₹150 - ₹250', duration: '30 mins' },
  { name: 'Hair Wash', category: 'Hair', genderCategory: 'Male', priceRange: '₹100 - ₹150', duration: '15 mins' },
  { name: 'Hair Styling', category: 'Hair', genderCategory: 'Male', priceRange: '₹150 - ₹300', duration: '20 mins' },
  { name: 'Hair Spa', category: 'Hair', genderCategory: 'Male', priceRange: '₹500 - ₹900', duration: '45 mins' },
  { name: 'Hair Mask Treatment', category: 'Hair', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
  { name: 'Hair Nourishing Mask', category: 'Hair', genderCategory: 'Male', priceRange: '₹350 - ₹650', duration: '30 mins' },
  { name: 'Hair Repair Mask', category: 'Hair', genderCategory: 'Male', priceRange: '₹400 - ₹700', duration: '35 mins' },
  { name: 'Hair Coloring', category: 'Hair', genderCategory: 'Male', priceRange: '₹500 - ₹1500', duration: '60 mins' },
  { name: 'Hair Smoothening', category: 'Hair', genderCategory: 'Male', priceRange: '₹1500 - ₹3000', duration: '120 mins' },
  { name: 'Keratin Treatment', category: 'Hair', genderCategory: 'Male', priceRange: '₹2000 - ₹4000', duration: '120 mins' },

  // MEN BEARD SERVICES
  { name: 'Beard Trim', category: 'Beard', genderCategory: 'Male', priceRange: '₹100 - ₹200', duration: '15 mins' },
  { name: 'Beard Styling', category: 'Beard', genderCategory: 'Male', priceRange: '₹150 - ₹300', duration: '20 mins' },
  { name: 'Beard Coloring', category: 'Beard', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
  { name: 'Beard Conditioning Treatment', category: 'Beard', genderCategory: 'Male', priceRange: '₹250 - ₹500', duration: '25 mins' },

  // MEN SKIN SERVICES
  { name: 'Face Cleanup', category: 'Skin', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
  { name: 'Facial', category: 'Skin', genderCategory: 'Male', priceRange: '₹800 - ₹1500', duration: '60 mins' },
  { name: 'Face Mask Treatment', category: 'Skin', genderCategory: 'Male', priceRange: '₹300 - ₹500', duration: '25 mins' },
  { name: 'Charcoal Face Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹400 - ₹600', duration: '30 mins' },
  { name: 'Hydrating Face Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹350 - ₹550', duration: '30 mins' },
  { name: 'Anti-Acne Face Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹450 - ₹700', duration: '35 mins' },
  { name: 'Skin Brightening Mask', category: 'Skin', genderCategory: 'Male', priceRange: '₹500 - ₹800', duration: '35 mins' },

  // MEN BODY WAXING
  { name: 'Chest Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹300 - ₹600', duration: '30 mins' },
  { name: 'Back Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹400 - ₹800', duration: '40 mins' },
  { name: 'Shoulder Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹200 - ₹400', duration: '20 mins' },
  { name: 'Stomach Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹300 - ₹500', duration: '30 mins' },
  { name: 'Full Body Wax', category: 'Waxing', genderCategory: 'Male', priceRange: '₹2000 - ₹4000', duration: '90 mins' },

  // MEN MASSAGE
  { name: 'Head Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹200 - ₹400', duration: '20 mins' },
  { name: 'Shoulder Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹250 - ₹450', duration: '25 mins' },
  { name: 'Back Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹400 - ₹800', duration: '30 mins' },
  { name: 'Full Body Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹1500 - ₹3000', duration: '60 mins' },
  { name: 'Aromatherapy Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹2000 - ₹4000', duration: '60 mins' },
  { name: 'Deep Tissue Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹2500 - ₹4500', duration: '60 mins' },
  { name: 'Hot Oil Massage', category: 'Massage', genderCategory: 'Male', priceRange: '₹1800 - ₹3500', duration: '60 mins' },

  // GROOM SERVICES
  { name: 'Groom Makeup', category: 'Bridal', genderCategory: 'Male', priceRange: '₹3000 - ₹8000', duration: '60 mins' },
  { name: 'Groom Facial', category: 'Bridal', genderCategory: 'Male', priceRange: '₹1500 - ₹3500', duration: '60 mins' },
  { name: 'Premium Beard Styling', category: 'Bridal', genderCategory: 'Male', priceRange: '₹500 - ₹1000', duration: '45 mins' },
  { name: 'Hair Styling for Groom', category: 'Bridal', genderCategory: 'Male', priceRange: '₹800 - ₹1500', duration: '45 mins' },
  { name: 'Pre-Groom Package', category: 'Bridal', genderCategory: 'Male', priceRange: '₹5000 - ₹12000', duration: '180 mins' },
  { name: 'Hair Coloring for Groom', category: 'Bridal', genderCategory: 'Male', priceRange: '₹1000 - ₹2500', duration: '60 mins' },

  // WOMEN HAIR SERVICES
  { name: 'Haircut', category: 'Hair', genderCategory: 'Female', priceRange: '₹300 - ₹700', duration: '45 mins' },
  { name: 'Hair Wash', category: 'Hair', genderCategory: 'Female', priceRange: '₹200 - ₹400', duration: '20 mins' },
  { name: 'Hair Styling', category: 'Hair', genderCategory: 'Female', priceRange: '₹400 - ₹1000', duration: '45 mins' },
  { name: 'Hair Spa', category: 'Hair', genderCategory: 'Female', priceRange: '₹800 - ₹1500', duration: '60 mins' },
  { name: 'Hair Mask Treatment', category: 'Hair', genderCategory: 'Female', priceRange: '₹500 - ₹1000', duration: '40 mins' },
  { name: 'Hair Nourishing Mask', category: 'Hair', genderCategory: 'Female', priceRange: '₹600 - ₹1200', duration: '40 mins' },
  { name: 'Hair Repair Mask', category: 'Hair', genderCategory: 'Female', priceRange: '₹700 - ₹1400', duration: '45 mins' },
  { name: 'Hair Strengthening Mask', category: 'Hair', genderCategory: 'Female', priceRange: '₹800 - ₹1500', duration: '45 mins' },
  { name: 'Hair Coloring', category: 'Hair', genderCategory: 'Female', priceRange: '₹1500 - ₹5000', duration: '90 mins' },
  { name: 'Hair Smoothening', category: 'Hair', genderCategory: 'Female', priceRange: '₹3000 - ₹6000', duration: '120 mins' },
  { name: 'Keratin Treatment', category: 'Hair', genderCategory: 'Female', priceRange: '₹4000 - ₹9000', duration: '150 mins' },

  // WOMEN SKIN SERVICES
  { name: 'Facial', category: 'Skin', genderCategory: 'Female', priceRange: '₹1000 - ₹3000', duration: '60 mins' },
  { name: 'Face Cleanup', category: 'Skin', genderCategory: 'Female', priceRange: '₹500 - ₹1000', duration: '40 mins' },
  { name: 'Threading', category: 'Skin', genderCategory: 'Female', priceRange: '₹50 - ₹150', duration: '15 mins' },

  // FACE MASK TREATMENTS (Women)
  { name: 'Charcoal Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹500 - ₹900', duration: '30 mins' },
  { name: 'Hydrating Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹600 - ₹1000', duration: '35 mins' },
  { name: 'Gold Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹1000 - ₹2000', duration: '45 mins' },
  { name: 'Anti-Acne Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹800 - ₹1500', duration: '40 mins' },
  { name: 'Skin Brightening Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹900 - ₹1800', duration: '45 mins' },
  { name: 'Collagen Face Mask', category: 'Skin', genderCategory: 'Female', priceRange: '₹1200 - ₹2500', duration: '45 mins' },

  // WAXING SERVICES (Women)
  { name: 'Eyebrow Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹100 - ₹200', duration: '15 mins' },
  { name: 'Upper Lip Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹50 - ₹150', duration: '10 mins' },
  { name: 'Chin Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹50 - ₹150', duration: '10 mins' },
  { name: 'Underarm Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹150 - ₹300', duration: '15 mins' },
  { name: 'Half Arm Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹250 - ₹500', duration: '20 mins' },
  { name: 'Full Arm Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹400 - ₹800', duration: '30 mins' },
  { name: 'Half Leg Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹350 - ₹700', duration: '30 mins' },
  { name: 'Full Leg Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹600 - ₹1200', duration: '45 mins' },
  { name: 'Full Body Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹2500 - ₹5000', duration: '90 mins' },

  // PREMIUM WAX TYPES
  { name: 'Chocolate Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹800 - ₹1500', duration: '45 mins' },
  { name: 'Rica Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹1200 - ₹2500', duration: '60 mins' },
  { name: 'Hard Wax', category: 'Waxing', genderCategory: 'Female', priceRange: '₹1000 - ₹2000', duration: '60 mins' },

  // MASSAGE SERVICES (Women)
  { name: 'Head Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹300 - ₹600', duration: '20 mins' },
  { name: 'Shoulder Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹400 - ₹800', duration: '30 mins' },
  { name: 'Back Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹600 - ₹1200', duration: '40 mins' },
  { name: 'Full Body Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹2000 - ₹4000', duration: '60 mins' },

  // PREMIUM MASSAGE
  { name: 'Aromatherapy Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹2500 - ₹5000', duration: '60 mins' },
  { name: 'Deep Tissue Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹3000 - ₹6000', duration: '60 mins' },
  { name: 'Hot Oil Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹2200 - ₹4500', duration: '60 mins' },
  { name: 'Hair & Scalp Therapy Massage', category: 'Massage', genderCategory: 'Female', priceRange: '₹1500 - ₹3000', duration: '45 mins' },

  // BRIDAL SERVICES
  { name: 'Bridal Makeup', category: 'Bridal', genderCategory: 'Female', priceRange: '₹8000 - ₹25000', duration: '150 mins' },
  { name: 'Bridal Hairstyle', category: 'Bridal', genderCategory: 'Female', priceRange: '₹2500 - ₹6000', duration: '90 mins' },
  { name: 'Bridal Facial Package', category: 'Bridal', genderCategory: 'Female', priceRange: '₹3000 - ₹8000', duration: '90 mins' },
  { name: 'Pre-Bridal Package', category: 'Bridal', genderCategory: 'Female', priceRange: '₹10000 - ₹30000', duration: '240 mins' },
  { name: 'Engagement Makeup', category: 'Bridal', genderCategory: 'Female', priceRange: '₹5000 - ₹15000', duration: '120 mins' },
  { name: 'Saree Draping', category: 'Bridal', genderCategory: 'Female', priceRange: '₹1000 - ₹3000', duration: '45 mins' },
  { name: 'Mehendi Application', category: 'Bridal', genderCategory: 'Female', priceRange: '₹2000 - ₹8000', duration: '120 mins' },

  // KIDS SERVICES
  { name: 'Kids Haircut', category: 'Hair', genderCategory: 'Kids', priceRange: '₹150 - ₹300', duration: '20 mins' },
  { name: 'Kids Hair Wash', category: 'Hair', genderCategory: 'Kids', priceRange: '₹100 - ₹200', duration: '15 mins' }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear existing to avoid infinite dupes during testing
    await Service.deleteMany({});
    
    const count = await Service.insertMany(allServices);
    
    return NextResponse.json({ success: true, count: count.length, message: "Database seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
