import { useState } from 'react';
import { Folder, File, Plus, MoreHorizontal, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const initialFolders = [
  { 
    id: 1, 
    name: 'Movie Review', 
    color: 'bg-blue-100',
    icon: 'text-blue-400',
    date: '12/12/2021'
  },
  { 
    id: 2, 
    name: 'Class Notes', 
    color: 'bg-red-100',
    icon: 'text-red-400',
    date: '12/12/2021'
  },
  { 
    id: 3, 
    name: 'Book Lists', 
    color: 'bg-yellow-100',
    icon: 'text-yellow-400',
    date: '12/12/2021'
  }
];

const initialNotes = [
  {
    id: 1,
    folderId: 1,
    title: 'Mid test exam',
    content: 'Ultrices viverra odio congue lecos felis, libero egestas nunc sagi are massa, elit ornare eget sem velit in ulum. In augue cursus of adipiscing felis, diam volutpat mauris, id and',
    color: 'bg-yellow-200',
    date: '12/12/2021',
    time: '10:30 PM, Monday'
  },
  {
    id: 2,
    folderId: 2,
    title: 'Mid test exam',
    content: 'Ultrices viverra odio congue lecos felis, libero egestas nunc sagi are massa, elit ornare eget sem velit in ulum. In augue cursus of adipiscing felis, diam volutpat mauris, id and',
    color: 'bg-red-200',
    date: '12/12/2021',
    time: '10:30 PM, Monday'
  },
  {
    id: 3,
    folderId: 3,
    title: 'Jonas\'s notes',
    content: 'Robity viverra odio congue lecos felis, libero egestas nunc sagi are massa, elit ornare eget sem velit in ulum.',
    color: 'bg-blue-200',
    date: '12/12/2021',
    time: '10:30 PM, Tuesday'
  }
];

const NotesApp = () => {
  const [folders, setFolders] = useState(initialFolders);
  const [notes, setNotes] = useState(initialNotes);
  const [activeTab, setActiveTab] = useState('Todays');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('December 2021');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
    setSelectedNote(null);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  const handleBackClick = () => {
    if (selectedNote) {
      setSelectedNote(null);
    } else if (selectedFolder) {
      setSelectedFolder(null);
    }
  };

  const filterNotesByFolder = (folderId) => {
    return notes.filter(note => note.folderId === folderId);
  };

  const handleNoteContentChange = (e, noteId) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        return { ...note, content: e.target.value };
      }
      return note;
    });
    setNotes(updatedNotes);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {selectedNote ? (
        // Full screen note editor view
        <div className="bg-white rounded-lg shadow-md p-4 min-h-screen">
          <div className="flex items-center mb-4">
            <button 
              className="mr-2 p-2 rounded-full hover:bg-gray-100"
              onClick={handleBackClick}
            >
              <ChevronLeft size={20} />
            </button>
            <input 
              className="text-xl font-semibold w-full outline-none" 
              value={selectedNote.title}
              onChange={(e) => {
                const updatedNotes = notes.map(note => {
                  if (note.id === selectedNote.id) {
                    return { ...note, title: e.target.value };
                  }
                  return note;
                });
                setNotes(updatedNotes);
              }}
            />
          </div>
          <textarea
            className="w-full h-full min-h-[80vh] p-2 outline-none resize-none"
            value={selectedNote.content}
            onChange={(e) => handleNoteContentChange(e, selectedNote.id)}
            autoFocus
          />
          <div className="flex items-center text-gray-400 text-sm mt-4">
            <Clock size={16} className="mr-1" />
            <span>{selectedNote.time}</span>
          </div>
        </div>
      ) : (
        <div>
          {selectedFolder ? (
            // Folder Notes View
            <div>
              <div className="flex items-center mb-4">
                <button 
                  className="mr-2 p-2 rounded-full hover:bg-gray-100"
                  onClick={handleBackClick}
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold">{selectedFolder.name}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterNotesByFolder(selectedFolder.id).map(note => (
                  <div 
                    key={note.id} 
                    className={`${note.color} rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{note.title}</h3>
                      <div className="p-1 rounded-full hover:bg-gray-200">
                        <MoreHorizontal size={16} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-4 mb-4">{note.content}</p>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      <span>{note.time}</span>
                    </div>
                  </div>
                ))}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-40 cursor-pointer hover:border-gray-400"
                  onClick={() => {
                    const newNoteId = Math.max(...notes.map(n => n.id)) + 1;
                    const newNote = {
                      id: newNoteId,
                      folderId: selectedFolder.id,
                      title: 'New Note',
                      content: '',
                      color: selectedFolder.color.replace('100', '200'),
                      date: new Date().toLocaleDateString(),
                      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ', ' + new Date().toLocaleDateString('en-US', {weekday: 'long'})
                    };
                    setNotes([...notes, newNote]);
                    setSelectedNote(newNote);
                  }}
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <Plus size={20} className="text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-500">New Note</span>
                </div>
              </div>
            </div>
          ) : (
            // Main View with Folders and Notes
            <div>
              {/* Recent Folders Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Recent Folders</h2>
                <div className="flex border-b mb-4">
                  <button 
                    className={`px-4 py-2 ${activeTab === 'Todays' ? 'border-b-2 border-gray-800' : ''}`}
                    onClick={() => handleTabClick('Todays')}
                  >
                    Todays
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'This Week' ? 'border-b-2 border-gray-800' : ''}`}
                    onClick={() => handleTabClick('This Week')}
                  >
                    This Week
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'This Month' ? 'border-b-2 border-gray-800' : ''}`}
                    onClick={() => handleTabClick('This Month')}
                  >
                    This Month
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {folders.map(folder => (
                    <div 
                      key={folder.id} 
                      className={`${folder.color} rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                      onClick={() => handleFolderClick(folder)}
                    >
                      <div className="flex justify-between mb-4">
                        <div className={`${folder.icon} w-10 h-10 rounded flex items-center justify-center`}>
                          <Folder size={24} />
                        </div>
                        <div className="p-1 rounded-full hover:bg-gray-200">
                          <MoreHorizontal size={16} />
                        </div>
                      </div>
                      <h3 className="font-semibold mb-1">{folder.name}</h3>
                      <p className="text-xs text-gray-500">{folder.date}</p>
                    </div>
                  ))}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
                    onClick={() => {
                      const newFolderId = Math.max(...folders.map(f => f.id)) + 1;
                      const colors = ['bg-purple-100', 'bg-green-100', 'bg-indigo-100'];
                      const icons = ['text-purple-400', 'text-green-400', 'text-indigo-400'];
                      const randomColor = colors[Math.floor(Math.random() * colors.length)];
                      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
                      
                      const newFolder = {
                        id: newFolderId,
                        name: 'New Folder',
                        color: randomColor,
                        icon: randomIcon,
                        date: new Date().toLocaleDateString()
                      };
                      setFolders([...folders, newFolder]);
                    }}
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <Plus size={24} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">New Folder</span>
                  </div>
                </div>
              </div>

              {/* My Notes Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-700">My Notes</h2>
                  <div className="flex items-center">
                    <button className="p-1 mr-1">
                      <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-gray-500">{currentMonth}</span>
                    <button className="p-1 ml-1">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex border-b mb-4">
                  <button 
                    className={`px-4 py-2 ${activeTab === 'Todays' ? 'border-b-2 border-gray-800' : ''}`}
                    onClick={() => handleTabClick('Todays')}
                  >
                    Todays
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'This Week' ? 'border-b-2 border-gray-800' : ''}`}
                    onClick={() => handleTabClick('This Week')}
                  >
                    This Week
                  </button>
                  <button 
                    className={`px-4 py-2 ${activeTab === 'This Month' ? 'border-b-2 border-gray-800' : ''}`}
                    onClick={() => handleTabClick('This Month')}
                  >
                    This Month
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.map(note => (
                    <div 
                      key={note.id} 
                      className={`${note.color} rounded-lg p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                      onClick={() => handleNoteClick(note)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{note.title}</h3>
                        <div className="p-1 rounded-full hover:bg-gray-200">
                          <MoreHorizontal size={16} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-4 mb-4">{note.content}</p>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Clock size={12} className="mr-1" />
                        <span>{note.time}</span>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-56 cursor-pointer hover:border-gray-400"
                    onClick={() => {
                      const newNoteId = Math.max(...notes.map(n => n.id)) + 1;
                      const newNote = {
                        id: newNoteId,
                        folderId: null, // No folder
                        title: 'New Note',
                        content: '',
                        color: 'bg-gray-100',
                        date: new Date().toLocaleDateString(),
                        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ', ' + new Date().toLocaleDateString('en-US', {weekday: 'long'})
                      };
                      setNotes([...notes, newNote]);
                      setSelectedNote(newNote);
                    }}
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <Plus size={20} className="text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">New Note</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesApp;