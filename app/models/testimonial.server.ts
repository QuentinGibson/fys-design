import { prisma } from "~/db.server";

export async function createTestimonial(data: any) {
  const testimonial = await prisma.testimonial.create({ data });
  return [null, testimonial];
}

export async function getTestimonialByID(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id } });
    return testimonial;
  } catch (error: any) {
    console.error("Error returning testimonial. Message: " + error.message);
  }
}

export async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany();
  return testimonials;
}

export async function updateTestimonialByID(id: string, data: any) {
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data,
  });
  return [null, testimonial]
}

export async function deleteTestimonialByID(id: string) {
  const deletedTestimonial = await prisma.testimonial.delete({ where: { id } });
  return [null, deletedTestimonial]
}
