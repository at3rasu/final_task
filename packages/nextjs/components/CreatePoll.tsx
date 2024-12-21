import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface OptionInputProps {
  optionInput: string;
  setOptionInput: React.Dispatch<React.SetStateAction<string>>;
  addOption: () => void;
}

const OptionInput: React.FC<OptionInputProps> = ({ optionInput, setOptionInput, addOption }) => (
  <div className="flex items-center space-x-4 mb-5">
    <input
      type="text"
      placeholder="Добавить вариант ответа"
      value={optionInput}
      onChange={e => setOptionInput(e.target.value)}
      className="flex-1 p-3 text-white bg-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
    />
    <button
      onClick={addOption}
      className="bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200"
    >
      Добавить вариант
    </button>
  </div>
);

export default function CreatePoll() {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "VotingContract",
  });

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions([...options, optionInput.trim()]);
      setOptionInput("");
    }
  };

  const createPoll = async () => {
    if (question && options.length > 1 && duration > 0) {
      await writeContractAsync({
        functionName: "createPoll",
        args: [question, options, BigInt(duration)],
      });
    } else {
      alert("Пожалуйста, заполните все поля корректно.");
    }
  };

  return (
    <div className="p-8 bg-blue-600 text-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold mb-6 text-left">Создать голосование</h2>
      <input
        type="text"
        placeholder="Введите вопрос голосования"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        className="w-full p-4 mb-5 text-white bg-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
      />
      <OptionInput optionInput={optionInput} setOptionInput={setOptionInput} addOption={addOption} />
      {options.length > 0 && (
        <ul className="space-y-2 mb-5 text-left">
          {options.map((opt, idx) => (
            <li key={idx} className="text-lg text-gray-300">
              {opt}
            </li>
          ))}
        </ul>
      )}
      <input
        type="number"
        placeholder="Длительность (в секундах)"
        onChange={e => setDuration(Number(e.target.value))}
        className="w-full p-4 mb-5 text-white bg-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-300"
      />
      <button
        onClick={createPoll}
        disabled={isMining}
        className={`w-full py-3 rounded-lg text-white ${isMining ? "bg-gray-500" : "bg-teal-600 hover:bg-teal-700"} focus:ring-2 focus:ring-teal-500 transition duration-200`}
      >
        {isMining ? "Создание..." : "Создать голосование"}
      </button>
    </div>
  );
}
