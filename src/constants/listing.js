const LISTER_ROLES = ['landlord', 'agent'];

const LISTING_STATUS = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    UNDER_REVIEW: 'under_review',
    PUBLISHED: 'published',
    REJECTED: 'rejected'
};


const EDITABLE_STATUSES = [LISTING_STATUS.DRAFT, LISTING_STATUS.REJECTED];

module.exports = {
    LISTER_ROLES,
    LISTING_STATUS,
    EDITABLE_STATUSES
};