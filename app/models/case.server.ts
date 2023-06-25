import { prisma } from "~/db.server";

export async function createCase(data: any) {
  try {
    const newCase = await prisma.case.create(data);
    return { newCase };
  } catch (error: any) {
    console.error("Error creating a new case. Message: " + error.message);
  }
}

export async function getCaseByID(id: string) {
  try {
    const caseObj = await prisma.case.findUnique({ where: { id } });
    return { caseObj };
  } catch (error: any) {
    console.error("Error finding case. Message: " + error.message);
  }
}

export async function getCases() {
  try {
    const cases = await prisma.case.findMany();
    return { cases };
  } catch (error: any) {
    console.error("Error getting all cases. Message: " + error.message);
  }
}

export async function updateCaseByID(id: string, data: any) {
  try {
    await prisma.case.update({ where: { id }, data });
  } catch (error: any) {
    console.error("Error updating case. Message: " + error.message);
  }
}

export async function deleteCaseByID(id: string) {
  try {
    const oldCase = await prisma.case.delete({ where: { id } });
    return { oldCase };
  } catch (error: any) {
    console.error("Error deleting case. Message: " + error.message);
  }
}
