import AddEventForm2 from '@components/forms/Event2';
import { Box } from '@components/index';
import { IAddEventPage, IAddEventPageProps } from '@interfaces/pages/addevent';

const AddEventPage2: IAddEventPage<IAddEventPageProps> = () => {
    return (
        <div className="pages__addevent py-3 row">
            <Box className=" pages__addevent-rightSide justify-content-center col-md-12 p-3">
                <h2 className="fw-bold mb-4 text-start">Add Event</h2>
                <AddEventForm2 />
            </Box>
        </div>
    );
};

export default AddEventPage2;
