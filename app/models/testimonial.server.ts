import { prisma } from "~/db.server";

export async function createTestimonial(data: any) {
  try {
    const testimonial = await prisma.testimonial.create(data);
    return { testimonial };
  } catch (error: any) {
    console.error("Error creating testimonial. Message: " + error.message);
  }
}

export async function getTestimonialByID(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    return { testimonial };
  } catch (error: any) {
    console.error("Error returning testimonial. Message: " + error.message);
  }
}

export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany();
  } catch (error: any) {
    console.log("Error fetching testimonials. Message: " + error.message);
  }
}

export async function updateTestimonialByID(id: string, data: any) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data,
    });
  } catch (error: any) {
    console.log("Error updating testimonial. Message: " + error.message);
  }
}

export async function deleteTestimonialByID(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (error: any) {
    console.log("Error deleting testimonial. Message: " + error.message);
  }
}
