import React from 'react';
import { IContactPage, IContactPageProps } from '@interfaces/pages/contact';
import Footer from '@components/layouts/Footer';
import ContactForm from '@components/forms/Contact';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HelpIcon from '@mui/icons-material/Help';

const ContactPage: IContactPage<IContactPageProps> = () => {
    return (
        <div className="pages__contact-page">
            <div className="pages__contact-page-breadcrumb">Home / Contact Us</div>
            <div className="pages__contact-page-contact-section">
                <h1>Contact Us</h1>
                <p>Have any questions? We'd love to hear from you.</p>
                <hr></hr>
                <br></br>
                <div className="pages__contact-page-contact-section-contact-content">
                    <div className="pages__contact-page-contact-section-contact-content-contact-info">
                        <h2>Contact Information</h2>
                        <p>Fill out the form and our team will get back to you soon.</p>
                        <ul>
                            <li>
                                <PhoneIcon /> +1(000)00-00000
                            </li>
                            <li>
                                <EmailIcon /> contact@barren.com
                            </li>
                            <li>
                                <HelpIcon /> Help Center
                            </li>
                        </ul>
                    </div>
                    <div>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
