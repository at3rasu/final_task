import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function EndPoll({ pollId }: { pollId: bigint }) {
  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const handleEndPoll = async () => {
    try {
      await writeContractAsync({
        functionName: "endPoll",
        args: [pollId],
      });
      alert("Голосование успешно завершено!");
    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при завершении голосования. Попробуйте еще раз.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl shadow-2xl mx-auto max-w-md">
      <h3 className="text-3xl font-bold mb-5">Завершение голосования</h3>
      <p className="text-lg mb-8">Вы уверены, что хотите завершить это голосование?</p>
      <button
        onClick={handleEndPoll}
        disabled={isMining}
        className={`w-full py-4 rounded-lg text-white font-semibold ${isMining ? "bg-gray-500 cursor-not-allowed" : "bg-red-800 hover:bg-red-900 focus:ring-4 focus:ring-red-500"}`}
      >
        {isMining ? "Завершаем..." : "Завершить голосование"}
      </button>
    </div>
  );
}
