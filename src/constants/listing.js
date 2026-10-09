const LISTER_ROLES = ['landlord', 'agent'];
const SAVER_ROLES = ['tenant'];

const LISTING_STATUS = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    PUBLISHED: 'published',
    REJECTED: 'rejected'
};

const EDITABLE_STATUSES = [LISTING_STATUS.DRAFT, LISTING_STATUS.REJECTED];



const CARD_ATTRIBUTES = [
    'listing_id', 'title', 'price', 'location', 'listing_type', 'listing_image_main',
    'bedroom', 'kitchen', 'flatmate', 'size', 'listing_status',
    ['reviewed_at', 'published_at']
];

module.exports = {
    LISTER_ROLES,
    SAVER_ROLES,
    LISTING_STATUS,
    EDITABLE_STATUSES,
    CARD_ATTRIBUTES
};