import {
    Card,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  export default function Footer() {
    return (
        <div className="width-screen">
      <Card className="max-w-100 mx-auto mt-16 p-8 shadow-lg rounded-lg bg-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Follow Us</CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          {/* Social Links Section */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                {/* Include your social icon SVG here */}
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                {/* Include your social icon SVG here */}
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                {/* Include your social icon SVG here */}
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                {/* Include your social icon SVG here */}
              </svg>
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 transition-colors duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                {/* Include your social icon SVG here */}
              </svg>
            </a>
          </div>
          {/* Optional: Add other footer content here */}
        </CardFooter>
      </Card>
      </div>
    );
  }
  