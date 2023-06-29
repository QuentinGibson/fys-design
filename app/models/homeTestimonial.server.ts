import { prisma } from "~/db.server";

export async function createHomeTestimonial(data: any) {
  try {
    const homeTestimonial = await prisma.homeTestimonial.create(data);
    return { homeTestimonial };
  } catch (error: any) {
    console.error("Error creating Home Testimonial. Message: " + error.message);
  }
}

export async function getHomeTestimonialByID(id: string) {
  try {
    const homeTestimonial = await prisma.homeTestimonial.findUnique({
      where: { id },
    });
    return { homeTestimonial };
  } catch (error: any) {
    console.error(
      "Error returning Home Testimonial. Message: " + error.message
    );
  }
}

export async function getHomeTestimonials() {
  try {
    const homeTestimonials = await prisma.homeTestimonial.findMany();
    return { homeTestimonials };
  } catch (error: any) {
    console.log("Error fetching testimonials. Message: " + error.message);
  }
}

export async function updateHomeTestimonialByID(id: string, data: any) {
  try {
    const testimonial = await prisma.homeTestimonial.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    console.log("Error updating testimonial. Message: " + error.message);
  }
}

export async function deleteHomeTestimonialByID(id: string) {
  try {
    await prisma.homeTestimonial.delete({ where: { id } });
  } catch (error: any) {
    console.log("Error deleting testimonial. Message: " + error.message);
  }
}
