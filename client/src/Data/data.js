export const userMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house'
    },
    {
        name: 'Profile',
        path: '/profile',
        icon: 'fa-solid fa-user'
    },
    {
        name: 'Feedbacks',
        path: '/user/feedbacks',
        icon: 'fa-solid fa-comments'
    },
    {
        name: 'Appointments',
        path: '/appointments',
        icon: 'fa-solid fa-list'
    },
    {
        name: 'Apply Membership',
        path: '/apply-membership',
        icon: 'fa-solid fa-user-doctor'
    },
    {
        name: 'Create Feedback',
        path: '/user/create-feedback',
        icon: 'fa-regular fa-comment'
    },
];

//admin menu
export const adminMenu = [
    {
        name: 'Home',
        path: '/',
        icon: 'fa-solid fa-house'
    },
    {
        name: 'POS',
        path: '/admin/create-order',
        icon: 'fa-solid fa-cart-plus'
    },
    {
        name: 'Inventory',
        path: '/admin/inventory',
        icon: 'fa-solid fa-box'
    },
    {
        name: 'Feedbacks',
        path: '/admin/user-feedbacks',
        icon: 'fa-solid fa-comments'
    },
    {
        name: 'Members',
        path: '/admin/members',
        icon: 'fa-solid fa-user-doctor'
    },
    {
        name: 'Guests',
        path: '/admin/users',
        icon: 'fa-solid fa-user'
    },
    {
        name: 'Profile',
        path: `/admin/profile/:userId`,
        icon: 'fa-solid fa-user'
    },

];