import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Clock, Check } from "lucide-react";

function ProgramDetails() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Hero Section with Eligibility Check */}
        <div className="relative">
          <div className="flex flex-col md:flex-row rounded-xl overflow-hidden bg-[#0E4091]">
            <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
              <CardHeader className="p-0">
                <p className="text-[#FBBC04] text-sm font-medium">
                  University of California
                </p>
                <CardTitle className="text-white text-3xl font-bold">
                  Computer Science, BSc
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-white text-base mb-4">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>
                <Button className="bg-[#FBBC04] text-[#0E4091] hover:bg-[#e0a903] font-bold">
                  Apply Now
                </Button>
              </CardContent>
            </div>
            <img
              src="/src/assets/img.jpg"
              alt="Program details"
              className="w-full md:w-1/3 h-64 md:h-auto object-cover"
            />
          </div>
          <Button className="absolute top-4 right-4 bg-blue-600 text-white rounded-full h-auto w-auto p-2">
            <Check size={16} />
          </Button>
        </div>

        {/* Program Overview and Eligibility Check Button */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Computer Science, BSc</h2>
            <p className="text-gray-600 mb-4">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-2 text-sm">
                <li>
                  <b>Duration:</b> 4 years (8 semesters)
                </li>
                <li>
                  <b>Level:</b> Bachelor's Degree
                </li>
                <li>
                  <b>Study mode:</b> Full-time
                </li>
                <li>
                  <b>Language:</b> English
                </li>
                <li>
                  <b>Campus:</b> Los Angeles, California, USA
                </li>
              </ul>
              <ul className="space-y-2 text-sm font-medium">
                <li>
                  <span className="text-green-500">🏠</span> On-campus housing
                  available
                </li>
                <li>
                  <span className="text-green-500">💼</span> Internship
                  opportunities
                </li>
                <li>
                  <span className="text-green-500">🚌</span> Campus shuttle
                  service
                </li>
              </ul>
            </div>
          </div>
          <Button className="ml-4 bg-blue-600 text-white flex items-center gap-2">
            <Check size={16} />
            Eligibility check
          </Button>
        </div>

        {/* Admission Requirements */}
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Admission Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Academic Requirements</h3>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> High school
                  diploma or equivalent
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Minimum GPA:
                  3.5/4.0
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Mathematics:
                  Pre-Calculus
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Science:
                  Physics etc
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Language Requirements</h3>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> TOEFL: 4 years
                  (8 semesters)
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> IELTS:
                  Bachelor's Degree
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> SAT: Full-time
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Required Documents</h3>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> High School
                  Diploma
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Official
                  Transcript
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Passport Copy
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> English
                  Proficiency Test
                </li>
                <li className="flex items-center">
                  <span className="text-[#0E4091] mr-2">•</span> Letter of
                  Recommendation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fees & Program Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Fees Structure (Per Year)</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-bold text-[#0E4091]">$45,000</p>
                <p className="text-sm">Tuition Fee</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-bold text-[#0E4091]">$25,00</p>
                <p className="text-sm">Deposit</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-bold text-red-500">$105</p>
                <p className="text-sm">Application Fee</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xl font-bold text-green-600">$18,000</p>
                <p className="text-sm">Living Expenses</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Program features</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-[#0E4091]" /> Boston, MA, USA
              </li>
              <li className="flex items-center gap-2">
                <Calendar size={16} className="text-[#0E4091]" /> 12 Sept, 2026
              </li>
              <li className="flex items-center gap-2">
                <Users size={16} className="text-[#0E4091]" /> 120 seats remain
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-[#0E4091]" /> 2 months to close
              </li>
            </ul>
          </div>
        </div>

        {/* Available Intakes */}
        <div className="p-6 bg-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Available Intakes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Badge className="bg-green-600 text-white font-semibold rounded-md py-1 px-3">
                Fall 2026 - September (Open)
              </Badge>
              <Badge className="bg-gray-400 text-white font-semibold rounded-md py-1 px-3">
                Winter 2027 - January (Closed)
              </Badge>
              <Badge className="bg-[#FBBC04] text-white font-semibold rounded-md py-1 px-3">
                Summer 2027 - June (Limited Seats)
              </Badge>
            </div>
            <div className="flex flex-col gap-2 font-semibold">
              <div className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                Deadline: Fall - May 1st
              </div>
              <div className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                Deadline: Fall - May 1st
              </div>
              <div className="bg-[#FBBC04] text-[#0E4091] rounded-md py-1 px-3">
                Deadline: Fall - May 1st
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button className="bg-[#0E4091] text-white font-bold px-8 hover:bg-[#0E4091]/90">
            Apply
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 px-8 hover:bg-gray-100"
          >
            Back to Programs
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}

export default ProgramDetails;