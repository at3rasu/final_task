import CreatePoll from "~~/components/CreatePoll";
// Импорт компонента для создания голосования
import PollResults from "~~/components/PollResults";

// Импорт компонента для отображения результатов

export default function PollPage() {
  return (
    <div className="flex justify-between p-8 mx-auto max-w-screen-lg">
      <div className="w-full max-w-md mr-8">
        <CreatePoll />
      </div>
      <div className="w-full max-w-md">
        <PollResults />
      </div>
    </div>
  );
}
