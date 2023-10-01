import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { validateName } from "~/utils";

export async function createIndustry(data: Prisma.IndustryCreateInput) {
  const errors: InputError = {}
  const { name } = data
  if (!validateName) {
    errors.name = "Invalid name. Please try another name."
  }
  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }
  const industry = await prisma.industry.create({ data });
  return [null, industry]
}

export async function getIndustryByID(id: string) {
  const industry = await prisma.industry.findUnique({ where: { id } })
  return industry;
}

export async function getIndustries() {
  const industries = await prisma.industry.findMany();
  return industries;
}

export async function updateIndustryById(id: string, data: any) {
  const errors: InputError = {}
  const { name } = data
  if (!validateName) {
    errors.name = "Invalid name. Please try another name."
  }
  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }
  const industry = await prisma.industry.update({ data, where: { id } });
  return [null, industry]
}

export async function deleteIndustryByID(id: string) {
  const industry = await prisma.industry.delete({ where: { id } });
  return [null, industry];
}
