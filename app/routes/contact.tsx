import ContactForm from "../components/ContactForm";
import Squiggle from "~/components/Squiggle";

export default function ContactRoute() {
  return (
    <main>
      <div className="py-8">
        <Squiggle />
        <ContactForm />
      </div>
    </main>
  );
};