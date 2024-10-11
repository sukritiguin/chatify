import { FaClock, FaInfoCircle } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TestIntroductionPage = ({ test }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {test.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          {/* Description */}
          <div className="flex items-start space-x-3">
            <AiOutlineFileText className="text-xl text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600">{test.description || "No description provided."}</p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center space-x-3">
            <FaClock className="text-xl text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold">Duration</h3>
              <p className="text-gray-600">{test.duration} minutes</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex items-start space-x-3">
            <FaInfoCircle className="text-xl text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold">Instructions</h3>
              <p className="text-gray-600">{test.instructions || "Please read the questions carefully before answering."}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Start Test
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestIntroductionPage;
