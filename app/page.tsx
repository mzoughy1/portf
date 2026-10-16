import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Guestbook } from "@/components/guestbook";
import { Hero } from "@/components/hero";
import { Interests } from "@/components/interests";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { personJsonLd } from "@/lib/jsonld";

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main" tabIndex={-1} className="pt-16 outline-none">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Interests />
        <Guestbook />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
