import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Eye, ChevronLeft, ChevronRight, Download, Search, ChevronDown, Menu, X } from 'lucide-react';

const ContentApp = () => {
  // State to track if navbar is expanded
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  
  // Calculate current year and last 3 years
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Sample data for the content table
  const [allContents, setAllContents] = useState([
    { id: 'fres2uf4sws', name: 'Physics Mechanics', subject: 'Physics', uploadDate: '7/18/2023', uploadedBy: 'Dr. Smith', status: 'Completed' },
    { id: 'css32uf43E', name: 'Linear Algebra', subject: 'Maths', uploadDate: '8/21/2023', uploadedBy: 'Prof. Johnson', status: 'In Process' },
    { id: 'asws4uf433', name: 'World War II', subject: 'History', uploadDate: '5/30/2023', uploadedBy: 'Dr. Williams', status: 'In Process' },
    { id: 'ssw32uf4sd', name: 'Shakespeare', subject: 'English', uploadDate: '4/21/2023', uploadedBy: 'Prof. Davis', status: 'Need More Info' },
    { id: 'sws2uf43y6', name: 'Chemistry Basics', subject: 'Chemistry', uploadDate: '12/10/2023', uploadedBy: 'Dr. Miller', status: 'Unassigned' },
    { id: 'dsw32uf34fr', name: 'Calculus', subject: 'Maths', uploadDate: '8/30/2023', uploadedBy: 'Prof. Wilson', status: 'Completed' },
    { id: 'gwl32uf34gr', name: 'Organic Chemistry', subject: 'Chemistry', uploadDate: '2/15/2024', uploadedBy: 'Dr. Lee', status: 'Completed' },
    { id: 'rsw32uf34fn', name: 'Optics', subject: 'Physics', uploadDate: '3/12/2024', uploadedBy: 'Prof. Zhang', status: 'In Process' },
    { id: 'tsw32uf34fq', name: 'Literature Review', subject: 'English', uploadDate: '1/5/2024', uploadedBy: 'Dr. Brown', status: 'Completed' },
  ]);

  const [filteredContents, setFilteredContents] = useState([...allContents]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [subjectData, setSubjectData] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    subject: true,
    uploadDate: true,
    uploadedBy: true,
    id: true,
    view: true
  });

  // Calculate subject percentages based on content data
  useEffect(() => {
    // Get unique subjects
    const subjects = [...new Set(allContents.map(content => content.subject))];
    
    // Define colors for subjects
    const colors = {
      'Physics': '#c1d956',
      'Chemistry': '#8c6ec2',
      'Maths': '#00d8a7',
      'English': '#999c99',
      'History': '#ff9f40',
      // Add more colors for other subjects as needed
    };
    
    // Calculate percentages
    const subjectStats = subjects.map(subject => {
      const count = allContents.filter(content => content.subject === subject).length;
      const percentage = Math.round((count / allContents.length) * 100);
      
      return {
        name: subject,
        percentage,
        color: colors[subject] || '#' + Math.floor(Math.random()*16777215).toString(16), // Random color as fallback
        status: subject
      };
    });
    
    setSubjectData(subjectStats);
  }, [allContents]);

  // Listen for navbar expansion toggle events from parent
  useEffect(() => {
    // This function would be triggered by a custom event when navbar expands/collapses
    const handleNavbarToggle = (event) => {
      setIsNavbarExpanded(event.detail.expanded);
    };
    
    // Listen for the custom event
    window.addEventListener('navbarToggle', handleNavbarToggle);
    
    return () => {
      window.removeEventListener('navbarToggle', handleNavbarToggle);
    };
  }, []);

  // Adjust visible columns based on screen size and navbar state
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const effectiveWidth = isNavbarExpanded ? screenWidth - 240 : screenWidth; // Assuming navbar width is 240px
      
      if (effectiveWidth < 640) { // Mobile
        setVisibleColumns({
          name: true,
          subject: true,
          uploadDate: false,
          uploadedBy: false,
          id: false,
          view: true
        });
      } else if (effectiveWidth < 1024) { // Tablet
        setVisibleColumns({
          name: true,
          subject: true,
          uploadDate: true,
          uploadedBy: false,
          id: true,
          view: true
        });
      } else { // Desktop
        setVisibleColumns({
          name: true,
          subject: true,
          uploadDate: true,
          uploadedBy: true,
          id: true,
          view: true
        });
      }
    };

    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [isNavbarExpanded]);

  // Filter contents based on selected year, month, and search query
  useEffect(() => {
    let filtered = [...allContents];
    
    // Filter by year
    if (selectedYear !== 'All') {
      filtered = filtered.filter(content => {
        const date = new Date(content.uploadDate);
        return date.getFullYear().toString() === selectedYear;
      });
    }
    
    // Filter by month
    if (selectedMonth !== 'All') {
      filtered = filtered.filter(content => {
        const date = new Date(content.uploadDate);
        return months[date.getMonth()] === selectedMonth;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(content => 
        content.name.toLowerCase().includes(query) ||
        content.subject.toLowerCase().includes(query) ||
        content.uploadedBy.toLowerCase().includes(query) ||
        content.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredContents(filtered);
  }, [selectedYear, selectedMonth, searchQuery, allContents]);

  // Format date for display (MM/DD/YYYY)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  // Extract date parts for filtering
  const getMonthFromDate = (dateStr) => {
    const date = new Date(dateStr);
    return months[date.getMonth()];
  };

  const getYearFromDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  // View all contents for a specific subject
  const handleViewAllForSubject = (subject) => {
    setSearchQuery('');
    setSelectedYear('All');
    setSelectedMonth('All');
    setFilteredContents(allContents.filter(content => content.subject === subject));
  };

  // Calculate items to display based on pagination
  const displayedContents = filteredContents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <div className="bg-gradient-to-r from-violet-300 to-violet-200 min-h-screen">
      <div className={`container mx-auto px-2 sm:px-4 py-4 ${isNavbarExpanded ? 'ml-0 sm:ml-52 lg:ml-64 transition-all duration-300' : ''}`}>
        {/* Overview Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-violet-600 mb-4 sm:mb-6">Content</h1>
          
          {/* Subject cards grid - responsive */}
          <div className={`grid grid-cols-1 ${isNavbarExpanded ? 'sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-2 sm:gap-4`}>

            {subjectData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex flex-col items-center">
                <div className="h-16 w-16 sm:h-24 sm:w-24 relative mb-1 sm:mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: item.name, value: item.percentage },
                          { name: 'Remaining', value: 100 - item.percentage }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={48}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell fill={item.color} />
                        <Cell fill="#F0F0F0" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm sm:text-lg font-bold text-black">{item.percentage}</span>
                  </div>
                </div>
                <div className="text-sm sm:text-lg font-bold" style={{ color: item.color }}>{item.status}</div>
                <button 
                  className="mt-2 sm:mt-3 px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs sm:text-sm hover:bg-gray-300"
                  onClick={() => handleViewAllForSubject(item.name)}
                >
                  View All
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contents Section */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-6">
          
          {/* Mobile Filter Toggle Button */}
          <div className="block sm:hidden mb-3">
            <button 
              className="w-full px-4 py-2 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center"
              onClick={toggleMobileFilters}
            >
              {showMobileFilters ? (
                <>
                  <X size={16} className="mr-2" /> Hide Filters
                </>
              ) : (
                <>
                  <Menu size={16} className="mr-2" /> Show Filters
                </>
              )}
            </button>
          </div>
          
          {/* Filters - responsive layout */}
          <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block mb-4`}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 mb-2 items-start sm:items-center">
              
              {/* Year dropdown */}
              <div className="relative w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg flex items-center justify-between"
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                >
                  {selectedYear === 'All' ? 'All Years' : selectedYear} <ChevronDown size={16} className="ml-1" />
                </button>
                
                {showYearDropdown && (
                  <div className="absolute z-10 mt-1 w-full sm:w-auto bg-white rounded-lg shadow-lg border border-gray-200">
                    <button 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        setSelectedYear('All');
                        setShowYearDropdown(false);
                      }}
                    >
                      All Years
                    </button>
                    {years.map(year => (
                      <button 
                        key={year}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setSelectedYear(year.toString());
                          setShowYearDropdown(false);
                        }}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Month dropdown */}
              <div className="relative w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg flex items-center justify-between"
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                >
                  {selectedMonth === 'All' ? 'All Months' : selectedMonth} <ChevronDown size={16} className="ml-1" />
                </button>
                
                {showMonthDropdown && (
                  <div className="absolute z-10 mt-1 w-full sm:w-auto bg-white rounded-lg shadow-lg border border-gray-200">
                    <button 
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        setSelectedMonth('All');
                        setShowMonthDropdown(false);
                      }}
                    >
                      All Months
                    </button>
                    {months.map(month => (
                      <button 
                        key={month}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowMonthDropdown(false);
                        }}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search bar */}
              <div className="relative w-full sm:w-auto sm:ml-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 hover:border-violet-600 focus:border-violet-600 focus:ring-0 focus:outline-none rounded-lg sm:w-48 md:w-64"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
            </div>
          </div>
          
          {/* Table - responsive design */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  {visibleColumns.name && (
                    <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-violet-600">Content Name</th>
                  )}
                  {visibleColumns.subject && (
                    <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-violet-600">Subject</th>
                  )}
                  {visibleColumns.uploadDate && (
                    <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-violet-600">Upload Date</th>
                  )}
                  {visibleColumns.uploadedBy && (
                    <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-violet-600">Uploaded By</th>
                  )}
                  {visibleColumns.id && (
                    <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-violet-600">Document ID</th>
                  )}
                  {visibleColumns.view && (
                    <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium text-violet-600">View</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {displayedContents.length > 0 ? (
                  displayedContents.map((content, index) => (
                    <tr 
                      key={content.id} 
                      className={`${selectedRow === index ? 'bg-yellow-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                      onClick={() => setSelectedRow(index)}
                    >
                      {visibleColumns.name && (
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium truncate max-w-xs sm:max-w-sm">{content.name}</td>
                      )}
                      {visibleColumns.subject && (
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm truncate">{content.subject}</td>
                      )}
                      {visibleColumns.uploadDate && (
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm truncate">{content.uploadDate}</td>
                      )}
                      {visibleColumns.uploadedBy && (
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm truncate">{content.uploadedBy}</td>
                      )}
                      {visibleColumns.id && (
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm font-mono truncate">{content.id}</td>
                      )}
                      {visibleColumns.view && (
                        <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm">
                          <button
                            className="text-gray-500 hover:text-violet-500"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row selection when clicking the icon
                              // Open document in a new window without navbar
                              window.open(
                                `/documents/${content.id}`,
                                `document_${content.id}`,
                                'toolbar=no,location=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=800'
                              );
                            }}
                          >
                            <Eye size={4} className="sm:size-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Object.values(visibleColumns).filter(Boolean).length} className="py-4 text-center text-xs sm:text-sm text-gray-500">
                      No matching documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination - responsive */}
          {filteredContents.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                Showing {Math.min(1 + (currentPage - 1) * itemsPerPage, filteredContents.length)} to {Math.min(currentPage * itemsPerPage, filteredContents.length)} of {filteredContents.length} entries
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-1 sm:p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  className="p-1 sm:p-2 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage * itemsPerPage >= filteredContents.length}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentApp;