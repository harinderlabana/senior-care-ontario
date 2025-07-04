import React from "react";
import { Link } from "react-router-dom";
import Meta from "../common/Meta";

// --- This section would be automated in a real-world CMS ---
// For now, we manually list the articles we've created.
const articles = [
  {
    slug: "health-at-home",
    title: "Navigating Ontario Health at Home: Your First Step to Senior Care",
    snippet:
      "When a loved one in Ontario begins to need support with daily living, the journey to finding appropriate care can feel overwhelming. You might be wondering where to start, what services are available, and how to access them. In Ontario, your first and most crucial step is connecting with Ontario Health at Home (formerly Home & Community Care Support Services). This organization is the gateway to a wide range of publicly funded home, community, and long-term care services.",
  },
  {
    slug: "in-home-vs-long-term",
    title:
      "In-Home Care vs. Long-Term Care in Ontario: Which is Right for Your Family?",
    snippet:
      "One of the most significant decisions families in Ontario face when a senior loved one requires care is whether to pursue in-home care or transition to a long-term care facility. Both options offer distinct benefits and drawbacks, and the right choice is highly individual, depending on your loved one's needs, health status, preferences, and your family's resources. Let's explore the key differences to help you make an informed decision.",
  },
  {
    slug: "understanding-the-costs",
    title:
      "Understanding the Costs: Financial Assistance Programs for Senior Care in Ontario",
    snippet:
      "The cost of senior care in Ontario can be a significant concern for families. Whether you're looking into in-home support or considering a long-term care home, understanding the financial landscape and the various assistance programs available is crucial. The good news is that the Ontario government offers several tax credits and benefits designed to help ease this burden.",
  },
  {
    slug: "checklist",
    title: "A Checklist for Choosing a Long-Term Care Home in Ontario",
    snippet:
      "Choosing a long-term care home for a loved one is one of the most significant decisions a family can make. It's a process that requires careful consideration, research, and often, emotional resilience. To help guide you through this important journey, we've put together a comprehensive checklist based on best practices and what families in Ontario need to know.",
  },
  {
    slug: "family-managed-home-care",
    title:
      "The Family-Managed Home Care Program in Ontario: Taking Control of Your Loved One's Care",
    snippet:
      "For many families, keeping a loved one at home for as long as possible is a priority. While Ontario Health at Home provides publicly funded care, some families desire a greater level of control and flexibility over who provides the care and how it's delivered. That's where the Family-Managed Home Care (FMHC) Program in Ontario comes in.",
  },
  {
    slug: "beyond-medical-care",
    title:
      "Beyond Medical Care: Exploring Community Support Services for Seniors in Ontario",
    snippet:
      "When we think about senior care, our minds often jump to medical needs and personal support. However, a crucial aspect of healthy aging and maintaining independence involves a network of community support services. These services, often non-medical, play a vital role in enhancing a senior's quality of life, preventing isolation, and supporting caregivers.",
  },
  {
    slug: "bill-of-rights",
    title:
      "The Residents' Bill of Rights: What Every Family Needs to Know for Long-Term Care in Ontario",
    snippet:
      "When a loved one moves into a long-term care home in Ontario, it's natural for families to feel a mix of emotions – relief, sadness, and often, concern about their loved one's well-being and rights. The good news is that residents of long-term care homes in Ontario are protected by law through a comprehensive Residents' Bill of Rights, outlined in the Long-Term Care Homes Act, 2007.",
  },
  {
    slug: "support-for-the-caregiver",
    title:
      "Support for the Caregiver: Resources for Families of Seniors in Ontario",
    snippet:
      "Being a caregiver for a senior loved one in Ontario is an act of profound love and dedication. Whether you're helping with daily tasks, managing appointments, or providing emotional support, the role can be incredibly rewarding. However, it can also be physically, emotionally, and financially draining. Caregiver burnout is a very real and serious issue.",
  },
  {
    slug: "preparing-for-the-future",
    title:
      "Preparing for the Future: Legal Documents and Senior Care Planning in Ontario",
    snippet:
      "Thinking about the future can be daunting, especially when it involves potential health decline or a loss of capacity. However, proactive planning, particularly through legal documents, is one of the most loving and responsible things you can do for your senior loved ones and your family in Ontario. These documents ensure that your loved one's wishes are respected and that someone is legally authorized to make decisions on their behalf when they can no longer do so.",
  },
  {
    slug: "when-is-it-time",
    title:
      "When is it Time? Recognizing the Signs Your Senior Loved One Needs More Care in Ontario",
    snippet:
      "It's a common dilemma for families in Ontario: how do you know when your senior loved one needs more support than you're currently providing? The signs can be subtle at first, often dismissed as just getting older. However, recognizing these indicators is crucial for their safety, well-being, and overall quality of life. Intervening proactively can prevent crises and ensure a smoother transition to increased care.",
  },
];
// --- End of manual section ---

const BlogPage = () => {
  return (
    <main className="animate-fade-in">
      <Meta
        title="Family Resource Center | SeniorCare Ontario"
        description="Your expert guide to understanding senior care options in Ontario. Read our articles to make your decision with confidence."
      />
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#0c2d48]">
            Family Resource Center
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Answers and advice to help you navigate your senior care journey
            with confidence.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="text-[#145DA0] hover:underline">
              &larr; Back to Main Directory
            </Link>
          </div>
          <div className="space-y-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-200"
              >
                <h2 className="font-heading text-2xl font-bold text-[#145DA0]">
                  {article.title}
                </h2>
                <p className="mt-2 text-gray-700 leading-relaxed">
                  {article.snippet}
                </p>
                <span className="mt-4 inline-block font-semibold text-[#0c2d48] hover:underline">
                  Read article &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
