import { prisma } from "~/db.server";

export async function createIndustry(data: any) {
  try {
    const industry = await prisma.industry.create(data);
    return { industry };
  } catch (error: any) {
    console.error("Error creating Industry. Message: " + error.message);
  }
}

export async function getIndustryByID(id: string) {
  try {
    const industry = await prisma.industry.findUnique({ where: { id } });
    return { industry };
  } catch (error: any) {
    console.error("Error finding industry. Message: " + error.message);
  }
}

export async function getIndustries() {
  const industries = await prisma.industry.findMany();
  return industries;
}

export async function updateIndustries(id: string, data: any) {
  try {
    const industry = await prisma.industry.update({ where: { id }, data });
    return { industry };
  } catch (error: any) {
    console.error("Error updating project. Message: " + error.message);
  }
}

export async function deleteIndustryByID(id: string) {
  try {
    const industry = await prisma.industry.delete({ where: { id } });
    return { industry };
  } catch (error: any) {
    console.error("Error deleting industry. Message: " + error.message);
  }
}
