import React, { useState } from 'react';

const ListingAIChat = ({ listing }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer('');

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          listingData: listing,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setAnswer(data.answer);

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setAnswer('Sorry, something went wrong while trying to get an answer. Please try again.');
    } finally {
      setIsLoading(false);
      setQuestion(''); // Clear input after asking
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Ask me anything about {listing ? `"${listing.title}"` : 'this listing'}
      </h2>
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          placeholder="e.g., How safe is the neighborhood?"
          className="w-full p-4 pr-24 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          onClick={handleAskQuestion}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? 'Asking...' : 'Ask'}
        </button>
      </div>
      
      {answer && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default ListingAIChat; 