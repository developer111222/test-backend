const Event = require('../model/eventmodel')
const { default: slugify } = require('slugify');


//-----------------------------create event----------------------------------

exports.createEvent = async (req, res) => {

    try {
        const { title, content, location, startDate, endDate, openingTime, closeTime } = req.body;
        const image = req.file ? req.file.filename : null;
        const author = req.user.id;
        // Validate required fields
        if (!title || !content || !location || !startDate || !endDate || !openingTime || !closeTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new event
        const newEvent = new Event({
            title,
            content,
            location,
            startDate,
            endDate,
            openingTime,
            closeTime,
            image,
            author
        });

        // Save the event to the database
        await newEvent.save();

        return res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
}



//-----------------------------get all events----------------------------------

exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate('author', 'username');
        return   res.status(200).json(events);
    } catch (error) {
        console.error(error);
     return   res.status(500).json({ message: 'Failed to get all events', error: error.message });
    }
}

//-----------------------------get single event----------------------------------

exports.getSingleEvent = async (req, res, next) => {

    const slug = req.params.id;
    console.log(slug)
    try {
        const event = await Event.findOne({ slug }).populate('author', 'username');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
       return res.status(200).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to get event', error: error.message });
    }
}


//-----------------------------update event----------------------------------



exports.updateEvent = async (req, res) => {
    try {
        const slug = req.params.id;  // Use the `id` from the request parameters for slug
        console.log(slug, "slug");

        const { title, content, location, startDate, endDate, openingTime, closeTime } = req.body;
        const image = req.file ? req.file.filename : null;

        const event = await Event.findOne({slug});  // Find the event by slug
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Regenerate slug if the title has changed
        if (title && title !== event.title) {
            console.log(event.title, "eveny");
            event.title = title;
            event.slug = slugify(title, { lower: true, strict: true });  // Update the slug
        }

        // Check if the new slug already exists (excluding the current event)
        if (req.body.slug && req.body.slug !== event.slug) {
            const existingSlug = await Event.findOne({ slug: req.body.slug });
            if (existingSlug) {
                return res.status(400).json({ message: 'Slug already in use' });
            }
        }

        // Update fields based on the request body
        if (title) event.title = title;
        if (content) event.content = content;
        if (location) event.location = location;
        if (startDate) event.startDate = startDate;
        if (endDate) event.endDate = endDate;
        if (openingTime) event.openingTime = openingTime;
        if (closeTime) event.closeTime = closeTime;

        // Don't update the image if no new image is uploaded
        if (image !== null) {
            event.image = image;  // Update the image if new one is uploaded
        }

        console.log("Updated event data:", event);

        // Save the updated event document
        const updatedEvent = await event.save();  // This will save all changes to the event

        return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });

    } catch (error) {
        return res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
};



//-----------------------------------delete events-------------------------------------

exports.deleteEvent = async (req, res, next) => {

    const { id } = req.params;
    try {
        const event = await Event.findByIdAndDelete(id);
        return res.status(200).json({message:"deleted successfully"})
        
    } catch (error) {
        return res.status(500).json({message:"server errro",error:error.message})
    }
}