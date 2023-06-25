import { prisma } from "~/db.server";

export async function createService(data: any) {
  try {
    const service = await prisma.service.create(data);
    return { service };
  } catch (error: any) {
    console.error("Error creating service. Message: " + error.message);
  }
}

export async function getServiceByID(id: string) {
  try {
    const service = await prisma.service.findUnique({ where: { id } });
    return { service };
  } catch (error: any) {
    console.error("Error finding service. Message: " + error.message);
  }
}

export async function getServices() {
  try {
    const services = await prisma.service.findMany();
    return { services };
  } catch (error: any) {
    console.error("Error getting all services. Message: " + error.message);
  }
}

export async function updateService(id: string, data: any) {
  try {
    const service = await prisma.service.update({ where: { id }, data });
    return { service };
  } catch (error: any) {
    console.error("Error updating service. Message: " + error.message);
  }
}

export async function deleteService(id: string) {
  try {
    const service = await prisma.service.delete({ where: { id } });
    return { service };
  } catch (error: any) {
    console.error("Error deleting service. Message: " + error.message);
  }
}
