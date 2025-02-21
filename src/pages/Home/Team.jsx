import { motion } from 'framer-motion';
import teamMember1 from '../../assets/images/reviewPerson1.jpg';
import teamMember2 from '../../assets/images/reviewPerson1.jpg';
import teamMember3 from '../../assets/images/reviewPerson1.jpg';

const teamMembers = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "CEO",
    image: teamMember1,
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "CTO",
    image: teamMember2,
  },
  {
    id: 3,
    name: "Charlie Brown",
    role: "COO",
    image: teamMember3,
  },
];

const Team = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <motion.h2 
        className="text-4xl font-semibold mb-4 text-center text-blue-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Team
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <motion.div 
            key={member.id} 
            className="m-4 flex flex-row items-center md:flex-col"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <div className="text-center">
              <h3 className="text-2xl font-semibold text-blue-500">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;
