import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function HasUserVoted({ pollId }: { pollId: bigint }) {
  const [userAddress, setUserAddress] = useState<string>("");

  const { data: hasVoted, isLoading } = useScaffoldReadContract({
    contractName: "VotingContract",
    functionName: "hasUserVoted",
    args: [pollId, userAddress],
  });

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address);
    }
  }, [isConnected, address]);

  if (!isConnected) {
    return (
      <div className="p-6 bg-gray-700 text-white rounded-lg shadow-md mt-4">
        <p className="text-xl font-semibold">Подключите кошелек для проверки вашего статуса голосования.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg shadow-md mt-4">
        <p className="text-lg">Загрузка информации о голосовании...</p>
      </div>
    );
  }

  if (hasVoted === undefined) {
    return (
      <div className="p-6 bg-red-500 text-white rounded-lg shadow-md mt-4">
        <p className="text-lg">Не удалось получить информацию о вашем голосовании. Попробуйте позже.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-green-500 text-white rounded-lg shadow-md mt-4">
      {hasVoted ? (
        <p className="text-xl font-semibold">Вы уже проголосовали в этом голосовании.</p>
      ) : (
        <p className="text-xl font-semibold">Вы ещё не проголосовали в этом голосовании.</p>
      )}
    </div>
  );
}
