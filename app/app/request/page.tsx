import { RequestForm } from "./request-form";

export default function RequestPage() {
  return (
    <main className="app-page">
      <p className="kicker">On demand</p>
      <h1>Prep for a date you already have.</h1>
      <p className="lede">
        Tell us the interview. We write a pack and publish it through review,
        the same way every other pack ships.
      </p>
      <RequestForm />
    </main>
  );
}
