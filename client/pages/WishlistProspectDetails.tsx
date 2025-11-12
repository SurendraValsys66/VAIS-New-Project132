import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Download,
  Search,
  Settings2,
  RefreshCw,
  Building,
  Mail,
  MapPin,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Star,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface ProspectList {
  id: string;
  name: string;
  prospects: string[];
  createdAt: string;
}

interface ProspectData {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  jobTitle: string;
  jobLevel: string;
  jobFunction: string;
  department?: string;
  companyName: string;
  companyDomain: string;
  companySize: string;
  industry: string;
  revenue: string;
  country: string;
  city: string;
  state?: string;
  profileImageUrl?: string;
  engagementScore: number;
  intentScore: number;
  intentSignal: string;
  lastActivity: Date;
  recentActivities: string[];
  matchedTopics: string[];
  confidenceScore: number;
  yearsAtCompany?: number;
  totalExperience?: number;
  previousCompanies?: string[];
  education?: string;
  skills?: string[];
  selected: boolean;
}

// Sample prospect data for demonstration
const FIRST_NAMES = [
  "Sarah", "Michael", "Emma", "David", "Jennifer",
  "Alex", "Priya", "Liam", "Noah", "Olivia",
  "Ava", "Ethan", "Mia", "Isabella", "Sophia",
];

const LAST_NAMES = [
  "Johnson", "Chen", "Rodriguez", "Kim", "Taylor",
  "Smith", "Williams", "Brown", "Jones", "Garcia",
];

const COMPANY_POOL = [
  { name: "Autodesk", domain: "autodesk.com", industry: "Software", revenue: "$1B - $10B" },
  { name: "Bentley Systems", domain: "bentley.com", industry: "Software", revenue: "$500M - $1B" },
  { name: "Dassault Systèmes", domain: "3ds.com", industry: "Software", revenue: "$1B - $10B" },
  { name: "Siemens", domain: "siemens.com", industry: "Engineering", revenue: "$10B+" },
  { name: "ANSYS", domain: "ansys.com", industry: "Software", revenue: "$1B - $10B" },
  { name: "PTC", domain: "ptc.com", industry: "Software", revenue: "$1B - $10B" },
];

const generateProspectData = (prospectIds: string[]): ProspectData[] => {
  return prospectIds.map((id, index) => {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(index * 3) % LAST_NAMES.length];
    const company = COMPANY_POOL[index % COMPANY_POOL.length];
    const jobTitles = ["Senior Manager", "Director", "VP of Sales", "Engineering Lead", "Product Manager"];

    return {
      id,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.domain}`,
      phone: "+1-415-555-" + String((index % 9000) + 1000),
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      jobTitle: jobTitles[index % jobTitles.length],
      jobLevel: ["Manager", "Director", "Senior"][index % 3],
      jobFunction: ["Sales", "Engineering", "Product", "Marketing"][index % 4],
      companyName: company.name,
      companyDomain: company.domain,
      companySize: "1000-5000",
      industry: company.industry,
      revenue: company.revenue,
      country: ["USA", "UK", "Germany", "France"][index % 4],
      city: ["San Francisco", "New York", "London", "Berlin"][index % 4],
      profileImageUrl: "/api/placeholder/40/40",
      engagementScore: 60 + (index % 35),
      intentScore: 65 + (index % 30),
      intentSignal: ["Strong", "Very Strong", "Medium"][index % 3],
      lastActivity: new Date(Date.now() - (index % 20) * 86400000),
      recentActivities: ["Viewed product page", "Downloaded whitepaper"],
      matchedTopics: ["CAD", "PLM", "Manufacturing"],
      confidenceScore: 75 + (index % 20),
      yearsAtCompany: (index % 7) + 1,
      totalExperience: (index % 15) + 5,
      previousCompanies: ["Adobe", "Salesforce"],
      skills: ["Leadership", "Strategy"],
      selected: false,
    };
  });
};

export default function WishlistProspectDetails() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get list from localStorage
  const [lists] = useState<ProspectList[]>(() => {
    try {
      const raw = localStorage.getItem("prospect:lists");
      return raw ? (JSON.parse(raw) as ProspectList[]) : [];
    } catch {
      return [];
    }
  });

  const currentList = lists.find((l) => l.id === listId);

  if (!currentList) {
    return (
      <TooltipProvider>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                    onClick={() => navigate("/wishlist-prospects")}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">List Not Found</h1>
                <p className="text-sm text-gray-600 mt-1">The list you're looking for doesn't exist</p>
              </div>
            </div>
            <Button onClick={() => navigate("/wishlist-prospects")}>
              Return to Wishlist
            </Button>
          </div>
        </DashboardLayout>
      </TooltipProvider>
    );
  }

  const prospectData = generateProspectData(currentList.prospects);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ProspectData>("engagementScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({
    prospect: true,
    company: true,
    jobTitle: true,
    jobFunction: true,
    country: true,
    actions: true,
  });

  const columns = [
    { key: "prospect", label: "Prospect" },
    { key: "company", label: "Company" },
    { key: "jobTitle", label: "Job Title" },
    { key: "jobFunction", label: "Job Function" },
    { key: "country", label: "Country" },
    { key: "actions", label: "Actions" },
  ] as const;

  const toggleColumn = (columnKey: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Filter and search
  const filteredData = useMemo(() => {
    return prospectData.filter((item) => {
      const matchesSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof ProspectData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleDownload = () => {
    try {
      const csvHeader = ["Prospect Name", "Email", "Company", "Job Title", "Country"];
      const csvRows = paginatedData.map((prospect) => [
        prospect.fullName,
        prospect.email,
        prospect.companyName,
        prospect.jobTitle,
        prospect.country,
      ]);

      const csvContent = [
        csvHeader.join(","),
        ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${currentList.name.replace(/\s+/g, "_")}_prospects.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: `Downloaded ${paginatedData.length} prospects`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to download prospects",
        variant: "destructive",
      });
    }
  };

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-valasys-orange hover:bg-valasys-orange hover:text-white"
                    onClick={() => navigate("/wishlist-prospects")}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Back</TooltipContent>
              </Tooltip>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentList.name}</h1>
                <div className="text-sm text-gray-600 mt-1">
                  {currentList.prospects.length} prospect{currentList.prospects.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Columns"
                >
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setSearchTerm("")}
                      variant="outline"
                      size="icon"
                      aria-label="Reset filters"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-lg">List Prospects</CardTitle>
                  <Badge variant="secondary" className="bg-gray-100">
                    {selectedItems.length} Selected
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="bg-valasys-orange hover:bg-valasys-orange/90"
                        disabled={paginatedData.length === 0}
                        onClick={handleDownload}
                        size="icon"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 pl-6">
                        <Checkbox
                          checked={
                            selectedItems.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      {columnVisibility.prospect && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("fullName")}
                        >
                          <div className="flex items-center justify-between">
                            Prospect
                            <div className="ml-2">
                              {sortField === "fullName" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.company && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("companyName")}
                        >
                          <div className="flex items-center justify-between">
                            Company
                            <div className="ml-2">
                              {sortField === "companyName" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobTitle && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("jobTitle")}
                        >
                          <div className="flex items-center justify-between">
                            Job Title
                            <div className="ml-2">
                              {sortField === "jobTitle" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.jobFunction && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("jobFunction")}
                        >
                          <div className="flex items-center justify-between">
                            Job Function
                            <div className="ml-2">
                              {sortField === "jobFunction" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.country && (
                        <TableHead
                          className="cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleSort("country")}
                        >
                          <div className="flex items-center justify-between">
                            Country
                            <div className="ml-2">
                              {sortField === "country" ? (
                                sortDirection === "asc" ? (
                                  <ArrowUp className="w-3 h-3 text-valasys-orange" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-valasys-orange" />
                                )
                              ) : (
                                <ArrowUpDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </TableHead>
                      )}
                      {columnVisibility.actions && (
                        <TableHead className="w-16">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((prospect) => (
                        <TableRow key={prospect.id}>
                          <TableCell className="pl-6">
                            <Checkbox
                              checked={selectedItems.includes(prospect.id)}
                              onCheckedChange={(checked) =>
                                handleSelectItem(prospect.id, !!checked)
                              }
                            />
                          </TableCell>
                          {columnVisibility.prospect && (
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={prospect.profileImageUrl}
                                    alt={prospect.fullName}
                                  />
                                  <AvatarFallback className="bg-valasys-orange text-white text-xs">
                                    {prospect.firstName[0]}
                                    {prospect.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {prospect.fullName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {prospect.intentSignal}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.company && (
                            <TableCell>
                              <div className="font-medium text-gray-900 flex items-center">
                                <Building className="w-4 h-4 mr-1 text-gray-400" />
                                {prospect.companyName}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.jobTitle && (
                            <TableCell>
                              <div className="text-sm text-gray-900">
                                {prospect.jobTitle}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.jobFunction && (
                            <TableCell>
                              <div className="text-sm text-gray-900">
                                {prospect.jobFunction}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.country && (
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-900">
                                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                                {prospect.country}
                              </div>
                            </TableCell>
                          )}
                          {columnVisibility.actions && (
                            <TableCell>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <Mail className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{prospect.email}</TooltipContent>
                              </Tooltip>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-gray-500">No prospects found</div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
