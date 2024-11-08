import React from 'react';
import { Helmet } from 'react-helmet';

const Metadata = () => {
    return (
        <Helmet>
            <title>PassOP - Your Secure Password Manager</title>
            <meta name="description" content="PassOP is a simple and secure password manager built with React. Save, view, edit, and delete your passwords efficiently and securely." />
            <meta name="keywords" content="password manager, secure passwords, React, web application" />
            <meta name="author" content="Your Name" />
            <meta name="robots" content="index, follow" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="canonical" href="https://github.com/jinx-vi-0/passop" />

            {/* Open Graph Tags */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="PassOP - Your Secure Password Manager" />
            <meta property="og:description" content="Manage your passwords securely with PassOP." />
            <meta property="og:image" content="URL_TO_IMAGE" />
            <meta property="og:url" content="https://github.com/jinx-vi-0/passop" />
            <meta property="og:site_name" content="PassOP" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="PassOP - Your Secure Password Manager" />
            <meta name="twitter:description" content="Manage your passwords securely with PassOP." />
            <meta name="twitter:image" content="URL_TO_IMAGE" />
            <meta name="twitter:site" content="@YourTwitterHandle" />
            <meta name="twitter:creator" content="@YourTwitterHandle" />

            {/* Theme and Application Metadata */}
            <meta name="theme-color" content="#ffffff" />
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        </Helmet>
    );
};

export default Metadata;