import NavBar from "@/components/nav/navbar";

export default function AboutPage() {
  return (
    <>
      <NavBar>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-10">
          <h1 className="text-5xl font-bold text-white mb-8">About QbBookReview</h1>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">About Shashank Lahoti</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Hi, I&apos;m Shashank Lahoti, a high school student and a beginner quizbowler. I created QbBookReview because I noticed the extremely steep learning curve that comes with picking up quizbowl. When I first began quizbowl, I was completely clueless. It took me nearly four months to even begin answering questions correctly. This experience was challenging, and I realized that many other beginners likely face the same struggles.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              I created QbBookReview to help others who are in my position. The goal of this website is to make the transition into quizbowl smoother and more accessible. Here, you can find a wide array of books that are essential for quizbowl preparation, create personalized reading lists, and review books to share insights with the community. Whether you&apos;re just starting out or looking to improve your skills, QbBookReview is here to support you.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              My hope is that this platform will provide valuable resources and a supportive community for quizbowl enthusiasts at all levels. By sharing our knowledge and experiences, we can help each other grow and succeed in the exciting world of quizbowl. Thank you for visiting QbBookReview, and I look forward to seeing how this community evolves and supports one another.
            </p>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">Purpose of QbBookReview</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              QbBookReview is designed to be a comprehensive resource for quizbowl players of all levels. Our mission is to provide a platform where users can:
            </p>
            <ul className="list-disc list-inside mb-6 text-lg text-gray-700 leading-relaxed pl-5">
              <li>Find books that are essential for quizbowl preparation from our extensive library.</li>
              <li>Create personalized reading lists and flashcards to organize and streamline their study sessions.</li>
              <li>Review and rate books to help others discover valuable resources and expand their knowledge base. **Rating Coming Soon**</li>
            </ul>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Whether you&apos;re a seasoned quizbowler or just starting out, QbBookReview aims to support your journey with curated book recommendations, user-generated reviews, and powerful organizational tools. Join our community today and take your quizbowl preparation to the next level!
            </p>
            <h2 className="text-3xl font-semibold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2">Contact</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              If you have any questions, feedback, or suggestions, feel free to reach out to us at <a href="mailto:shashanklahoti34@gmail.com" className="text-blue-500 hover:underline">support@qbbookreview.com</a>. We&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </NavBar>
    </>
  );
}
