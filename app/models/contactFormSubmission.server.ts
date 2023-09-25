import { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { validateEmail } from "~/utils";

const isValidName = (name: string): boolean => {
  // Regular expression to match valid names (letters, hyphens, and spaces)
  const nameRegex = /^[A-Za-z\s\-]+$/;

  return (
    name.trim().length > 0 &&       // Ensure name is not empty or just whitespace
    name.length <= 50 &&            // Ensure name is not too long
    nameRegex.test(name)            // Ensure name matches the regex pattern
  );
};

const isValidMessage = (message: string): boolean => {
  // Define minimum and maximum length for the message
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;

  return (
    message.trim().length >= MIN_LENGTH &&       // Ensure message is not too short
    message.length <= MAX_LENGTH             // Ensure message is not too long
  );
};


export async function createContactFormSubmission(inputData: Omit<Prisma.ContactFormSubmissionCreateInput, 'service'> & { serviceId: string }) {
  let errors: any = {}
  const { firstName, lastName, serviceId, message, email } = inputData

  const service = prisma.service.findUnique({
    where: {
      id: serviceId
    }
  })

  if (!service) {
    errors.serviceId = "Invalid service. Please enter a valid service"
  }

  if (!isValidName(firstName)) {
    errors.firstName = "Please enter a valid first name"
  }
  if (!isValidName(lastName)) {
    errors.lastName = "Please enter a valid last name"
  }
  if (!validateEmail(email)) {
    errors.email = "Please enter a valid email"
  }
  if (!isValidMessage(message)) {
    errors.message = "Please enter a message between 10 and 500 characters"
  }
  if (Object.entries(errors).length > 0) {
    return [errors, null]
  }

  const result = await prisma.contactFormSubmission.create({data: inputData})
  return [null, result]
} 