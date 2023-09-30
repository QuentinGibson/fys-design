import { prisma } from "~/db.server";
import type { Service, Perk, Prisma } from "@prisma/client";
import { validateName } from "~/utils";
import { PrismaClientValidationError } from "@prisma/client/runtime";

type CustomPerk = Omit<Perk, "created_at"> & { created_at: string };

export type CustomService = Omit<Service, "created_at"> & {
  created_at: string;
  perks: CustomPerk[];
};
function isValidPerks(perks: Pick<Prisma.ServiceCreateInput, "perks">) {
  async function isIdValue(perk: string) {
    const res = prisma.perk.findUnique({ where: { id: perk } })
    return res !== null ? true : false
  }
  perks.forEach(perk => {
    if (!isIdValue(perk)) {
      return false
    }
  })
  return true
}
function isValidImageFileName(fileName: File): boolean {
  // Define a list of allowed image file extensions (add more as needed)
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  console.log(`FILENAME: ${fileName}`)

  // Get the file extension from the fileName
  const fileExtension = fileName.name.toLowerCase().slice((fileName.name.lastIndexOf(".") - 1 >>> 0) + 2);

  // Check if the file extension is in the list of allowed extensions
  return allowedExtensions.includes(`.${fileExtension}`);
}

function isValidDescription(description: string, maxLength: number = 400): boolean {
  // Check if the summary is a non-empty string
  if (typeof description !== "string" || description.trim().length === 0) {
    return false;
  }

  // Check if the summary length is within the specified limit
  if (description.length > maxLength) {
    return false;
  }

  // If all checks pass, the summary is considered valid
  return true;
}


export async function createService(data: Prisma.ServiceCreateInput) {
  let errors: InputError = {}

  // Validate Input Data
  let { name, image, description, perks } = data
  if (perks) {
    if (!isValidPerks(perks)) {
      errors.perks = "Invalid Perks. Perk id not found!"
    }
  }
  if (name) {
    if (!validateName(name)) {
      errors.name = "Invalid Name. Please enter a different name!"
    }
  }
  console.log(`IMAGE: ${image}`)
  if (image?.name?.length > 0) {
    if (!isValidImageFileName(image)) {
      errors.image = "Error, Please enter a valid image file."
    }
  }

  if (description) {
    if (!isValidDescription(description)) {
      errors.description = "Invalid Description. Please enter at most 400 characters!"
    }
  }

  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }
  console.log(`Perks map ${JSON.stringify(perks.map((perk: any) => ({ id: perk })))}`)
  data.perks = {
    connect: perks.map((perk: any) => ({ id: perk }))
  }

  // Call create Project
  const service = await prisma.service.create({ data: data, include: { perks } })
    .catch(error => {
      console.log(`Service creation error: ${error}`)
    });
  return [null, service];
}

export async function getServiceByID(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { perks: true }
    });
    return service;
  } catch (error: any) {
    console.error("Error finding service. Message: " + error.message);
  }
}

export async function getServicesAndPerks() {
  try {
    const services = await prisma.service.findMany({
      include: { perks: true },
    });
    return { services };
  } catch (error: any) {
    console.error("Error getting all services. Message: " + error.message);
  }
}

export async function getServices() {
  const services: Service[] = await prisma.service.findMany();
  return services;
}

export async function updateService(id: string, data: any) {
  let errors: InputError | null = {}

  // Validate Input Data
  let { name, description, image, perks } = data
  if (name && !validateName(name)) {
    errors.name = "Invalid Name. Please enter a different name!"
  }
  if (description && !isValidDescription(description)) {
    errors.description = "Invalid Description. Please enter a description within 200 characters!"
  }
  if (image.length > 0) {
    if (!isValidImageFileName(image)) {
      errors.image = "Error, Please enter a valid image file."
    }
  }

  if (image === "") {
    image = undefined
  }

  if (Object.keys(errors).length > 0) {
    return [errors, null]
  }

  if (perks) {
    data.perks = {
      connect:
        perks.map((perk: { label: string, value: string }) => ({
          id: perk.value
        }))

    }
  }

  // Call create Project
  const service = await prisma.service.update({ where: { id }, data: data })
    .catch(error => {
      console.log(`Project update error: ${error}`)
    });
  return [null, service];
}

export async function deleteService(id: string) {
  const service = await prisma.service.delete({ where: { id } });
  return [null, service];
}
