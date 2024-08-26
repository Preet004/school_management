const db = require('../config/db');

// Add School
exports.addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    // Validate input
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    db.query(query, [name, address, latitude, longitude], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding school.', error: err });
        }
        res.status(201).json({ message: 'School added successfully.', schoolId: result.insertId });
    });
};

// List Schools
exports.listSchools = (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and Longitude are required.' });
    }

    const query = 'SELECT * FROM schools';
    db.query(query, (err, schools) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching schools.', error: err });
        }

        // Calculate distance
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const toRad = (value) => (value * Math.PI) / 180;

            const R = 6371; // Radius of the Earth in kilometers
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c; // Distance in kilometers
        };

        const sortedSchools = schools.map(school => {
            const distance = calculateDistance(latitude, longitude, school.latitude, school.longitude);
            return { ...school, distance };
        }).sort((a, b) => a.distance - b.distance);

        res.status(200).json(sortedSchools);
    });
};
