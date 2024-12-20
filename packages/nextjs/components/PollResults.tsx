import { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function PollResults() {
  const [pollId, setPollId] = useState<number>(-1);

  const { data, isLoading, isError } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "getResults",
    args: [BigInt(pollId)],
  });

  return (
    <div className="p-6 bg-blue-600 text-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-semibold mb-4 text-left">Результаты голосования</h3>
      <input
        type="number"
        placeholder="Введите ID голосования"
        onChange={e => setPollId(e.target.value ? Number(e.target.value) : -1)}
        className="w-full p-3 mb-4 rounded-lg text-white bg-gray-700 placeholder-gray-500"
      />
      {isLoading && <div className="text-left text-lg text-white">Загружаем результаты...</div>}
      {isError && (
        <div className="bg-red-600 p-4 rounded-lg text-left text-white">
          Не удалось загрузить результаты. Попробуйте позже.
        </div>
      )}
      {data && !isLoading && !isError && (
        <div className="p-6 bg-blue-500 text-white rounded-lg shadow-lg w-full mt-6">
          <ul>
            {data[0].map((option: string, idx: number) => (
              <li key={idx} className="text-lg mb-3">
                <span className="font-semibold">{option}</span>: {Number(data[1][idx])} голосов
              </li>
            ))}
          </ul>
        </div>
      )}
      {!data && !isLoading && !isError && (
        <div className="text-left text-lg text-white mt-4">Введите ID голосования, чтобы увидеть результаты.</div>
      )}
    </div>
  );
}
