import EndPoll from "~~/components/EndPoll";
import HasUserVoted from "~~/components/HasUserVoted";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function PollList() {
  const { data: pollCount } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollCount",
  });

  const renderPolls = () => {
    if (!pollCount) return <p>Загрузка...</p>;
    const polls = [];
    for (let i: number = 0; i < pollCount; i++) {
      polls.push(<PollItem key={i} pollId={BigInt(i)} />);
    }
    return polls;
  };

  return (
    <div className="p-8 bg-blue-600 text-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-center">Список голосований</h2>
      {pollCount && pollCount > 0 ? renderPolls() : <p className="text-xl text-center">Нет активных голосований</p>}
    </div>
  );
}

function PollItem({ pollId }: { pollId: bigint }) {
  const { data } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getPollDetails",
    args: [BigInt(pollId)],
  });

  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  if (!data) return <p>Загрузка...</p>;

  const [question, options, , isActive] = data;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 hover:shadow-lg transition-all duration-300 ease-in-out">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{question}</h3>
      <ul className="space-y-3 mb-4">
        {options.map((opt: string, idx: number) => (
          <li key={idx} className="flex justify-between items-center text-lg text-gray-800">
            <span>{opt}</span>
            {isActive && (
              <button
                onClick={() =>
                  writeContractAsync({
                    functionName: "vote",
                    args: [BigInt(pollId), BigInt(idx)],
                  })
                }
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
              >
                Голосовать
              </button>
            )}
          </li>
        ))}
      </ul>
      {!isActive && <p className="text-red-600 font-semibold">Голосование завершено</p>}
      {isActive && <EndPoll pollId={pollId} />}
      <HasUserVoted pollId={pollId} />
    </div>
  );
}
