import React, { useState } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  Code,
  Brain,
  Database,
  Layers,
  ExternalLink,
  Plus,
} from "lucide-react";

// Types
interface Challenge {
  id: number;
  slug: string;
  title: string;
  duration: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: "Frontend" | "AI" | "DSA" | "Web3";
  examplePost: string;
  hashtags: string[];
  participantCount: number;
  isPopular?: boolean;
}

// Static challenge data
const challenges: Challenge[] = [
  {
    id: 1,
    slug: "100-days-of-code",
    title: "100 Days of Code",
    duration: "100 Days",
    description:
      "Build coding habits in public and improve your programming skills daily.",
    difficulty: "Beginner",
    category: "Frontend",
    examplePost:
      "Day 5 of #100DaysOfCode! Today I learned about React hooks and built a simple todo app. The useState hook is becoming clearer to me...",
    hashtags: ["#100DaysOfCode", "#CodingLife", "#WebDev"],
    participantCount: 12453,
    isPopular: true,
  },
  {
    id: 2,
    slug: "21-days-of-react",
    title: "21 Days of React",
    duration: "21 Days",
    description:
      "Master React fundamentals and build real-world projects step by step.",
    difficulty: "Intermediate",
    category: "Frontend",
    examplePost:
      "Day 8 of #21DaysOfReact - Diving deep into useEffect today! Built a weather app that fetches real-time data. The cleanup function finally makes sense...",
    hashtags: ["#21DaysOfReact", "#ReactJS", "#Frontend"],
    participantCount: 3247,
  },
  {
    id: 3,
    slug: "30-days-of-ai",
    title: "30 Days of AI",
    duration: "30 Days",
    description:
      "Explore artificial intelligence with hands-on projects and experiments.",
    difficulty: "Intermediate",
    category: "AI",
    examplePost:
      "Day 12 of #30DaysOfAI! Built my first neural network from scratch using Python. The backpropagation algorithm is fascinating...",
    hashtags: ["#30DaysOfAI", "#MachineLearning", "#AI"],
    participantCount: 8921,
    isPopular: true,
  },
  {
    id: 4,
    slug: "50-days-dsa",
    title: "50 Days of DSA",
    duration: "50 Days",
    description:
      "Solve data structures and algorithms problems to ace your coding interviews.",
    difficulty: "Advanced",
    category: "DSA",
    examplePost:
      "Day 23 of #50DaysOfDSA - Conquered dynamic programming today! Solved the longest common subsequence problem. The state transition finally clicked...",
    hashtags: ["#50DaysOfDSA", "#CodingInterview", "#Algorithms"],
    participantCount: 5632,
  },
  {
    id: 5,
    slug: "365-days-of-learning",
    title: "365 Days of Learning",
    duration: "365 Days",
    description:
      "A year-long journey of continuous learning and skill development.",
    difficulty: "Beginner",
    category: "Frontend",
    examplePost:
      "Day 127 of #365DaysOfLearning! Today I explored CSS Grid and created a responsive portfolio layout. Grid is so powerful for complex layouts...",
    hashtags: ["#365DaysOfLearning", "#LifelongLearning", "#Growth"],
    participantCount: 2156,
  },
  {
    id: 6,
    slug: "blockchain-bootcamp",
    title: "Blockchain Bootcamp",
    duration: "60 Days",
    description: "Learn Web3 development and build decentralized applications.",
    difficulty: "Advanced",
    category: "Web3",
    examplePost:
      "Day 15 of #BlockchainBootcamp! Deployed my first smart contract on testnet today. Seeing it work on the blockchain feels magical...",
    hashtags: ["#BlockchainBootcamp", "#Web3", "#Solidity"],
    participantCount: 1847,
  },
];

// Challenge Card Component
interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challenge: Challenge) => void;
  onViewDetails: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  onViewDetails,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend":
        return <Code className="w-5 h-5" />;
      case "AI":
        return <Brain className="w-5 h-5" />;
      case "DSA":
        return <Database className="w-5 h-5" />;
      case "Web3":
        return <Layers className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend":
        return "bg-blue-100 text-blue-800";
      case "AI":
        return "bg-purple-100 text-purple-800";
      case "DSA":
        return "bg-orange-100 text-orange-800";
      case "Web3":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              {getCategoryIcon(challenge.category)}
            </div>
            {challenge.isPopular && (
              <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-medium rounded-full">
                🔥 Popular
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
            >
              {challenge.difficulty}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}
            >
              {challenge.category}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {challenge.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {challenge.description}
        </p>

        {/* Challenge Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{challenge.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{challenge.participantCount.toLocaleString()} joined</span>
          </div>
        </div>
      </div>

      {/* Example Post Preview */}
      <div className="px-6 pb-4">
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Example Post:
          </p>
          <p className="text-sm text-gray-700 italic line-clamp-3">
            "{challenge.examplePost}"
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {challenge.hashtags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="px-6 pb-6">
        <div className="flex space-x-3">
          <button
            onClick={() => onJoin(challenge)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Join Challenge</span>
          </button>
          <button
            onClick={() => onViewDetails(challenge)}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Challenges Page Component
const ChallengesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Frontend", "AI", "DSA", "Web3"];

  const filteredChallenges =
    selectedCategory === "All"
      ? challenges
      : challenges.filter(
          (challenge) => challenge.category === selectedCategory,
        );

  const handleJoinChallenge = (challenge: Challenge) => {
    // TODO: Implement join challenge functionality
    console.log("Joining challenge:", challenge.title);
    alert(
      `Joining "${challenge.title}" - This will be connected to your backend!`,
    );
  };

  const handleViewDetails = (challenge: Challenge) => {
    // TODO: Navigate to challenge details page
    console.log("Viewing details for:", challenge.title);
    alert(
      `Viewing details for "${challenge.title}" - Challenge details page coming soon!`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Learning Challenges
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of learners building in public. Choose a challenge
              that matches your goals and start your learning journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {filteredChallenges.length}
                </span>{" "}
                challenges available
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">
                  {challenges
                    .reduce((sum, c) => sum + c.participantCount, 0)
                    .toLocaleString()}
                </span>{" "}
                total participants
              </span>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={handleJoinChallenge}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No challenges found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category or check back later for new
              challenges.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;
