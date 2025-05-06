import React from 'react';
import { Flame, Crown, Users, Atom } from 'lucide-react';

/**
 * RecentAchievements Component
 * 
 * Displays a 2x2 grid of achievement cards and stats information
 * 
 * @param {Object} props
 * @param {Array} props.achievements - Array of achievement objects
 * @param {Object} props.stats - Object containing stats information
 * @returns {JSX.Element}
 */
const RecentAchievements = ({ 
  achievements = [
    {
      id: 1,
      icon: 'flame',
      points: 100,
      title: 'Learning Streak',
      description: 'A month of consistent learning'
    },
    {
      id: 2,
      icon: 'crown',
      points: 500,
      title: 'Math Champion',
      description: 'Top scorer in Advanced Algebra'
    },
    {
      id: 3,
      icon: 'users',
      points: 250,
      title: 'Team Leader',
      description: 'Helped 10 peers this month'
    },
    {
      id: 4,
      icon: 'atom',
      points: 300,
      title: 'Science Whiz',
      description: 'Perfect score in Physics Quiz'
    }
  ],
  stats = {
    quizzesCompleted: 14,
    hoursSpent: 6
  }
}) => {
  // Map icon names to Lucide React components
  const iconComponents = {
    flame: Flame,
    crown: Crown,
    users: Users,
    atom: Atom
  };

  return (
    <div className="max-w-3xl ">
      {/* Recent Achievements Section */}
      <div className="bg-gray-200 rounded-2xl p-4 mb-8">
        <div className="grid grid-cols-2 gap-6 mt-5 mb-1 mx-1">
          {achievements.map((achievement) => {
            const IconComponent = iconComponents[achievement.icon];
            
            return ( 
              <div key={achievement.id} className="bg-white rounded-xl border border-gray-100 p-4 relative">
                <div className="flex justify-between items-start mb-8">
                  <div className="bg-gray-900 p-3 rounded-full">
                    {IconComponent && <IconComponent className="text-white" size={24} />}
                  </div>
                  <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    +{achievement.points} pts
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{achievement.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stats Section */}
    </div>
  );
};

export default RecentAchievements;