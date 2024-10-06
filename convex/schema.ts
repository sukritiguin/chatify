import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const profile = defineTable({
  userId: v.id("users"),
  name: v.string(),
  coverPhoto: v.optional(v.string()),
  profilePhoto: v.optional(v.string()),
  bio: v.optional(v.string()),
  educations: v.optional(
    v.array(
      v.object({
        institute: v.string(),
        course: v.string(),
        start: v.string(),
        end: v.string(),
        story: v.optional(v.string()),
      })
    )
  ),
  experiences: v.optional(
    v.array(
      v.object({
        company: v.string(),
        designation: v.string(),
        type: v.optional(
          v.union(
            v.literal("fulltime"),
            v.literal("internship"),
            v.literal("apprenticeship"),
            v.literal("parttime"),
            v.literal("WFH"),
            v.literal("freelance"),
            v.literal("")
          )
        ),
        start: v.string(),
        end: v.optional(v.string()),
      })
    )
  ),
  skills: v.optional(
    v.array(
      v.object({
        skill: v.string(),
        level: v.optional(
          v.union(
            v.literal("Beginner"),
            v.literal("Intermediate"),
            v.literal("Advanced"),
            v.literal("Proficient"),
            v.literal("Expert"),
            v.literal("Master"),
            v.literal("")
          )
        ),
      })
    )
  ),
  socials: v.optional(
    v.object({
      linkedIn: v.optional(v.string()),
      github: v.optional(v.string()),
      twitter: v.optional(v.string()),
    })
  ),
});

// Define the organizations table
const organizations = defineTable({
  name: v.string(), // Organization name (required)
  description: v.optional(v.string()), // Optional description of the organization
  website: v.optional(v.string()), // Optional website URL
  logo: v.optional(v.string()), // Optional logo of the organization
  banner: v.optional(v.string()), // Optional cover photo for the organization
  address: v.optional(v.string()), // Optional address of the organization
  industry: v.optional(v.string()), // Optional industry the organization belongs to
  established: v.optional(v.string()), // Optional year of establishment

  // Reference to the users table for the admin or owner of the organization
  adminUserId: v.id("users"), // Admin or creator of the organization (foreign key to users table)
});

// A table to keep track of the use who has individual profile or organization. Because a single user can't have both things together

const registeredAs = defineTable({
  userId: v.id("users"),
  type: v.union(v.literal("profile"), v.literal("organization")),
});

const posts = defineTable({
  userId: v.id("users"), // ID of the user who made the post
  content: v.string(), // Text content of the post/shared post
  media: v.optional(v.array(v.string())), // URLs of media (images, videos, documents)
  // User should not be allowed to share media while sharing post // TODO: Implement
  createdAt: v.optional(v.string()), // Timestamp when the post was created
  updatedAt: v.optional(v.string()), // Last updated timestamp
  visibility: v.union(
    v.literal("public"), // Public post visible to everyone
    v.literal("connections"), // Visible to connections only
    v.literal("private") // Visible only to the user (or group)
  ),
  reactions: v.optional(
    v.object({
      like: v.int64(), // Number of likes
      celebrate: v.int64(), // Number of celebrates
      support: v.int64(), // Number of supports
      insightful: v.int64(), // Number of insightful reactions
      love: v.int64(), // Number of loves
      funny: v.int64(), // Number of funny
      sad: v.int64(), // Number of sad
    })
  ),
  commentCount: v.int64(), // Number of comments on the post
  shareCount: v.int64(), // Number of shares of the post
  isPromoted: v.optional(v.boolean()), // Is the post a promoted one
  sharedPostId: v.optional(v.string()), // Refers to the original post (if this post is a share)
});

const comments = defineTable({
  postId: v.id("posts"), // The post this comment is associated with
  userId: v.id("users"), // The user who made the comment
  content: v.string(), // The text content of the comment
  parentId: v.optional(v.id("comments")), // ID of the parent comment for nested replies
  createdAt: v.string(), // Timestamp when the comment was made
  updatedAt: v.string(), // Last updated timestamp
  reactions: v.optional(
    v.object({
      like: v.int64(), // Number of likes
      celebrate: v.int64(), // Number of celebrates
      support: v.int64(), // Number of supports
      insightful: v.int64(), // Number of insightful reactions
      love: v.int64(), // Number of loves
      funny: v.int64(), // Number of funny
      sad: v.int64(), // Number of sad
    })
  ),
});

const feeds = defineTable({
  userId: v.id("users"), // The user who is viewing this feed entry
  postId: v.id("posts"), // The post that appears in the feed
  feedType: v.union(
    v.literal("home"), // General feed on the home page
    v.literal("profile"), // Posts appearing on a user's profile feed
    v.literal("organization"), // Posts from organizations followed by the user
    v.literal("promoted") // Sponsored or promoted posts
  ),
  visibility: v.union(
    v.literal("public"), // Public posts visible to the user
    v.literal("connections"), // Visible to connections only
    v.literal("private") // Private posts visible to the user
  ),
  rankScore: v.optional(v.float64()), // Ranking score to order posts in the feed
  createdAt: v.string(), // Timestamp when the post was added to the feed
  updatedAt: v.string(), // Timestamp when this feed entry was last updated
  engagement: v.optional(
    v.object({
      likes: v.int64(), // Number of likes
      comments: v.int64(), // Number of comments
      shares: v.int64(), // Number of shares
    })
  ),
  isPinned: v.optional(v.boolean()), // Whether this post is pinned to the top
  isRead: v.optional(v.boolean()), // Whether the post has been read by the user
  isHidden: v.optional(v.boolean()), // If the user has hidden this post
});

const notifications = defineTable({
  userId: v.id("users"), // The user who receives the notification
  type: v.union(
    v.literal("like"), // User liked a post
    v.literal("like_comment"),
    v.literal("comment"), // User commented on a post
    v.literal("share"), // User shared a post
    v.literal("mention"), // User was mentioned in a post or comment
    v.literal("connection_request"), // Received a connection request
    v.literal("connection_accept"), // Connection request accepted
    v.literal("endorsement"), // User was endorsed for a skill
    v.literal("profile_view"), // User's profile was viewed
    v.literal("job_posted"), // A job relevant to the user was posted
    v.literal("event_invitation"), // Invited to an event
    v.literal("group_invitation"), // Invited to join a group
    v.literal("article_recommendation"), // Recommended an article
    v.literal("announcement") // Platform announcements or updates
  ),
  referanceUrl: v.optional(v.string()),
  referenceId: v.optional(v.string()), // ID referencing the related entity (e.g., postId, commentId, userId)
  referenceType: v.optional(
    v.union(
      v.literal("posts"),
      v.literal("comments"),
      v.literal("users"),
      v.literal("jobs"),
      v.literal("events"),
      v.literal("groups"),
      v.literal("articles"),
      v.literal("announcements")
    )
  ), // Type of the referenced entity
  fromUserId: v.optional(v.id("users")), // The user who performed the action (if applicable)
  metadata: v.optional(
    v.object({
      // Additional data depending on the notification type
      message: v.optional(v.string()), // Custom message for the notification
      actionUrl: v.optional(v.string()), // URL to navigate when the notification is clicked
      // Add more fields as necessary based on notification types
    })
  ),
  createdAt: v.string(), // Timestamp when the notification was created
  isRead: v.boolean(), // Whether the notification has been read
});

const userConnections = defineTable({
  userId: v.id("users"), // ID of the user
  connectionUserId: v.id("users"), // ID of the connected user
  status: v.union(
    v.literal("pending"), // Connection request is pending
    v.literal("accepted"), // Connection request is accepted
    v.literal("rejected"), // Connection request was rejected
    v.literal("blocked") // User has blocked the other user
  ),
  createdAt: v.string(), // Timestamp when the connection was made
});

const userFollowings = defineTable({
  followedUserId: v.id("users"), // ID of the user who is being followed
  followedByUserId: v.id("users"), // ID of the user who is following
  followerRank: v.optional(v.float64()), // Rank of the based on some calculations
});

const postReactions = defineTable({
  postId: v.id("posts"), // The post being reacted to
  userId: v.id("users"), // The user reacting to the post
  reactionType: v.union(
    v.literal("Like"), // Like reaction
    v.literal("Celebrate"), // Celebrate reaction
    v.literal("Support"), // Support reaction
    v.literal("Insightful"), // Insightful reaction
    v.literal("Love"),
    v.literal("Sad"),
    v.literal("Funny")
  ),
  createdAt: v.string(), // Timestamp when the reaction was made
});

const commentReactions = defineTable({
  commentId: v.id("comments"), // The post being reacted to
  userId: v.id("users"), // The user reacting to the post
  reactionType: v.union(
    v.literal("Like"), // Like reaction
    v.literal("Celebrate"), // Celebrate reaction
    v.literal("Support"), // Support reaction
    v.literal("Insightful"), // Insightful reaction
    v.literal("Love"),
    v.literal("Sad"),
    v.literal("Funny")
  ),
  createdAt: v.string(), // Timestamp when the reaction was made
});

const conversationParticipant = defineTable({
  userId: v.id("users"), // ID of the participant (user)
  role: v.union(
    v.literal("admin"), // Admin of the group (in case of group chat)
    v.literal("member") // Regular participant
  ),
  joinedAt: v.optional(v.string()), // Timestamp when the user joined the conversation
});

const conversation = defineTable({
  title: v.string(),
  avatar: v.optional(v.string()),
  isGroupChat: v.boolean(),
  createdAt: v.optional(v.string()),
  updatedAt: v.optional(v.string()),
  // members: v.array(v.id("users")),
  firstUser: v.id("users"),
  secondUser: v.id("users"),
});

const messages = defineTable({
  conversationId: v.id("conversation"), // The conversation this message belongs to
  senderId: v.id("users"), // The user who sent the message
  content: v.string(), // The message text content
  media: v.optional(v.array(v.string())), // URLs of media (images, videos, documents)
  createdAt: v.string(), // Timestamp when the message was sent
  updatedAt: v.optional(v.string()), // Timestamp of the last update (for editing the message)
  isDeleted: v.optional(v.boolean()), // If the message has been deleted
  isEdited: v.optional(v.boolean()), // If the message has been edited
});

const messageReactions = defineTable({
  messageId: v.id("messages"), // The message being reacted to
  userId: v.id("users"), // The user reacting to the message
  reactionType: v.union(
    v.literal("Like"), // Like reaction
    v.literal("Celebrate"), // Celebrate reaction
    v.literal("Support"), // Support reaction
    v.literal("Insightful"), // Insightful reaction
    v.literal("Love"),
    v.literal("Sad"),
    v.literal("Funny")
  ),
  createdAt: v.optional(v.string()), // Timestamp when the reaction was made
});

const messageReads = defineTable({
  messageId: v.id("messages"), // The message being read
  userId: v.id("users"), // The user who read the message
  readAt: v.string(), // Timestamp when the message was read
});

const connection = defineTable({
  sender: v.id("users"),
  receiver: v.id("users"),
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("rejected")
  ),
});

// - Below is the schema for jobs section in LinkedIn like application.

const jobs = defineTable({
  userId: v.id("users"), // Reference to the organization
  title: v.string(),
  description: v.string(),
  location: v.string(),
  employmentType: v.union(
    v.literal("full_time"),
    v.literal("part_time"),
    v.literal("contract"),
    v.literal("internship"),
    v.literal("temporary"),
    v.literal("freelance")
  ),
  salaryRange: v.optional(
    v.object({
      min: v.number(),
      max: v.optional(v.number()),
      currency: v.string(),
    })
  ),
  skills: v.array(v.string()), // List of required skills (can be skill names or IDs)
  experienceLevel: v.union(
    v.literal("entry"),
    v.literal("mid"),
    v.literal("senior"),
    v.literal("lead"),
    v.literal("director"),
    v.literal("executive")
  ),
  postedBy: v.id("users"), // Reference to the user who posted the job
  createdAt: v.string(),
  updatedAt: v.optional(v.string()),
  isActive: v.boolean(),
});

const applications = defineTable({
  jobId: v.id("jobs"), // Reference to the job
  applicantId: v.id("users"), // Reference to the applicant
  resumeUrl: v.string(),
  coverLetter: v.optional(v.string()),
  status: v.union(
    v.literal("applied"),
    v.literal("shortlisted"),
    v.literal("accepted"),
    v.literal("rejected"),
    v.literal("hired")
  ),
  appliedAt: v.string(),
  updatedAt: v.optional(v.string()),
});

// -----------------------------------
// - Professional Test System Tables
// -----------------------------------
// 1. Tests Table
const tests = defineTable({
  title: v.string(), // Title of the test
  description: v.optional(v.string()), // Description of the test
  createdAt: v.string(), // ISO timestamp of test creation
  createdBy: v.id("users"), // Reference to the user who created the test
  duration: v.int64(), // Total duration of the test in minutes
  isActive: v.boolean(), // Indicates if the test is currently active
  accessType: v.union(
    v.literal("public"), // Anyone can take the test
    v.literal("private") // Only invited candidates can take the test
  ),
  maxAttempts: v.optional(v.int64()), // Maximum number of attempts allowed per candidate
  passScore: v.optional(v.float64()), // Minimum score required to pass
  randomizedQuestions: v.optional(v.boolean()), // If true, questions are randomized per candidate
  randomizedOptions: v.optional(v.boolean()), // If true, options are randomized per question
  testVersion: v.optional(v.string()), // Versioning for test updates
  tags: v.optional(v.array(v.string())), // Tags or categories for the test
  instructions: v.optional(v.string()), // General instructions for the test
});

// 2. Sections Table
const sections = defineTable({
  testId: v.id("tests"), // Foreign key to the test
  title: v.string(), // Title of the section
  instructions: v.optional(v.string()), // Specific instructions for the section
  sectionOrder: v.int64(), // Order of the section within the test
  duration: v.optional(v.int64()), // Duration for the section (optional)
  isMandatory: v.optional(v.boolean()), // If the section is mandatory
});

// 3. Question Banks Table
const questionBanks = defineTable({
  title: v.string(), // Title of the question bank
  description: v.optional(v.string()), // Description of the question bank
  createdAt: v.string(), // Timestamp when the question bank was created
  createdBy: v.id("users"), // Reference to the user who created the question bank
  tags: v.optional(v.array(v.string())), // Tags or categories for the question bank
});

// 4. Questions Table
const questions = defineTable({
  questionBankId: v.optional(v.id("questionBanks")), // Optional reference to a question bank for reusability
  sectionId: v.id("sections"), // Foreign key to the section
  type: v.union(
    v.literal("MCQ"), // Multiple Choice Question
    v.literal("MSQ"), // Multiple Select Question
    v.literal("Essay"), // Essay Question
    v.literal("Coding"), // Coding/Programming Question
    v.literal("TrueFalse") // True/False Question
  ),
  questionText: v.string(), // The text of the question
  createdAt: v.string(), // Timestamp when the question was created
  order: v.int64(), // Order of the question in the section
  isActive: v.boolean(), // Indicates if the question is active
  points: v.float64(), // Points assigned to the question
  hints: v.optional(v.array(v.string())), // Optional hints for the question
  attachments: v.optional(v.array(v.string())), // URLs to any attachments (images, PDFs, etc.)
});

// 5. Options Table
const options = defineTable({
  questionId: v.id("questions"), // Foreign key to the question
  optionText: v.string(), // Text of the option
  isCorrect: v.boolean(), // Whether the option is correct
  optionOrder: v.int64(), // Order of the option in the question
  feedback: v.optional(v.string()), // Optional feedback for the option
});

// 6. Test Assignments Table
const testAssignments = defineTable({
  testId: v.id("tests"), // Foreign key to the test
  candidateId: v.id("users"), // Reference to the candidate (user)
  assignedAt: v.string(), // Timestamp when the test was assigned
  dueDate: v.string(), // Due date for test submission
  status: v.union(
    v.literal("assigned"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("overdue")
  ), // Current status of the test assignment
  attemptCount: v.int64(), // Number of attempts made
  lastAttemptAt: v.optional(v.string()), // Timestamp of the last attempt
});

// 7. Test Submissions Table
const testSubmissions = defineTable({
  assignmentId: v.id("testAssignments"), // Foreign key to the test assignment
  startedAt: v.string(), // Timestamp when the test was started
  submittedAt: v.optional(v.string()), // Timestamp when the test was submitted
  score: v.optional(v.float64()), // The score achieved by the candidate
  duration: v.optional(v.int64()), // Duration taken to complete the test in seconds
  status: v.union(
    v.literal("submitted"),
    v.literal("graded"),
    v.literal("reviewed")
  ), // Status of the submission
  feedback: v.optional(v.string()), // Optional feedback from the evaluator
  reviewedBy: v.optional(v.id("users")), // Reference to the user who reviewed the submission
});

// 8. Answers Table
const answers = defineTable({
  submissionId: v.id("testSubmissions"), // Foreign key to the test submission
  questionId: v.id("questions"), // Foreign key to the question
  selectedOptionIds: v.optional(v.array(v.id("options"))), // Array of selected option IDs (for MCQ/MSQ)
  essayAnswer: v.optional(v.string()), // Text answer for essay questions
  codingAnswer: v.optional(v.string()), // Code snippet for coding questions
  isCorrect: v.optional(v.boolean()), // Whether the answer is correct (for automatic grading)
  pointsAwarded: v.optional(v.float64()), // Points awarded for this answer
  answeredAt: v.string(), // Timestamp when the question was answered
});

// 9. Question Tags Table (for better categorization and searching)
const questionTags = defineTable({
  questionId: v.id("questions"), // Foreign key to the question
  tag: v.string(), // Tag name
});

// 10. Test Logs Table (for auditing and tracking purposes)
const testLogs = defineTable({
  assignmentId: v.id("testAssignments"), // Reference to the test assignment
  action: v.union(
    v.literal("assigned"),
    v.literal("started"),
    v.literal("submitted"),
    v.literal("graded"),
    v.literal("reviewed"),
    v.literal("updated")
  ), // Action performed
  performedBy: v.id("users"), // User who performed the action
  timestamp: v.string(), // Timestamp of the action
  details: v.optional(v.string()), // Additional details about the action
});

// 11. Proctoring Sessions Table (Optional: If implementing proctoring)
const proctoringSessions = defineTable({
  submissionId: v.id("testSubmissions"), // Reference to the test submission
  proctorId: v.id("users"), // Reference to the proctor (admin)
  startedAt: v.string(), // Timestamp when proctoring started
  endedAt: v.optional(v.string()), // Timestamp when proctoring ended
  activities: v.optional(
    v.array(
      v.object({
        activityType: v.string(), // Type of activity (e.g., screen capture, webcam snapshot)
        timestamp: v.string(), // When the activity was recorded
        metadata: v.optional(v.object({})), // Additional data
      })
    )
  ), // Recorded activities during proctoring
});

// 12. Test Settings Table (For configurable test options)
const testSettings = defineTable({
  testId: v.id("tests"), // Reference to the test
  settingKey: v.string(), // Key/name of the setting
  settingValue: v.string(), // Value of the setting
});

const schema = defineSchema({
  ...authTables,
  profile,
  organizations,
  registeredAs,

  posts,
  comments,
  feeds,
  notifications,
  userConnections,
  userFollowings,
  postReactions,
  commentReactions,

  messageReads,
  messageReactions,
  messages,
  conversation,
  conversationParticipant,

  connection,

  jobs,
  applications,

  // - Professional Test System Tables
  tests,
  sections,
  questionBanks,
  questions,
  options,
  testAssignments,
  testSubmissions,
  answers,
  questionTags,
  testLogs,
  proctoringSessions,
  testSettings,
});

export default schema;

/*

### Documentation for Social Media Post/Feed System

This documentation provides a detailed overview of the schema for a social media-like application, including tables for posts, comments, feeds, notifications, user connections, and reactions. Each table is designed to handle specific features like user posts, sharing, commenting, and user interactions. 

### 1. `posts` Table
This table stores information about the posts created by users, including both original posts and shared posts. A post can contain text, media (images, videos, etc.), and also support reactions, comments, and shares.

**Fields:**
- `userId`: References the user who created the post.
- `content`: The textual content of the post.
- `media`: An array of media URLs (optional).
- `createdAt`: Timestamp when the post was created.
- `updatedAt`: Timestamp when the post was last updated.
- `visibility`: Defines the visibility of the post:
  - `public`: Visible to everyone.
  - `connections`: Visible to the user's connections.
  - `private`: Visible only to the user or certain groups.
- `reactions`: Stores different types of reactions (like, celebrate, support, etc.) and their counts.
- `commentCount`: Number of comments on the post.
- `shareCount`: Number of times the post was shared.
- `isPromoted`: Whether the post is promoted (optional).
- `sharedPostId`: References the original post if this is a shared post (optional).

**Usage:**
- Used to manage all posts on the platform, including original and shared posts.
- A shared post references the original post through `sharedPostId`.

---

### 2. `comments` Table
This table stores comments associated with a particular post. It supports nested comments by allowing replies to comments.

**Fields:**
- `postId`: The post to which this comment belongs.
- `userId`: The user who made the comment.
- `content`: The text content of the comment.
- `parentId`: If the comment is a reply, this stores the ID of the parent comment (optional).
- `createdAt`: Timestamp when the comment was created.
- `updatedAt`: Timestamp when the comment was last updated.
- `reactions`: Reactions to the comment, similar to post reactions.

**Usage:**
- Allows users to engage in discussions on posts with the ability to reply to specific comments.

---

### 3. `feeds` Table
The `feeds` table handles what posts appear in the user's feed. Each user has their own feed with posts ranked according to engagement and visibility.

**Fields:**
- `userId`: The user viewing the feed.
- `postId`: The post that appears in the feed.
- `feedType`: The type of feed, such as:
  - `home`: The general feed displayed on the home page.
  - `profile`: Posts shown on a user's profile.
  - `organization`: Posts from organizations the user follows.
  - `promoted`: Sponsored or promoted posts.
- `visibility`: The visibility of the post (public, connections, private).
- `rankScore`: A ranking score used for ordering posts in the feed (optional).
- `createdAt`: Timestamp when the post was added to the feed.
- `updatedAt`: Timestamp when the feed entry was last updated.
- `engagement`: Engagement metrics for the post in the feed (likes, comments, shares).
- `isPinned`: Whether the post is pinned to the top of the feed (optional).
- `isRead`: Whether the post has been read by the user (optional).
- `isHidden`: If the user has hidden the post from their feed (optional).

**Usage:**
- Manages which posts appear in a user’s feed and their ranking.

---

### 4. `notifications` Table
The `notifications` table stores actions that generate notifications for users. These actions include likes, comments, shares, and mentions.

**Fields:**
- `userId`: The user receiving the notification.
- `postId`: The post related to the notification (optional, e.g., in the case of a mention).
- `action`: The type of action that triggered the notification:
  - `like`: A user liked the post.
  - `comment`: A user commented on the post.
  - `share`: A user shared the post.
  - `mention`: The user was mentioned in a post or comment.
- `fromUserId`: The user who performed the action.
- `createdAt`: Timestamp when the notification was created.
- `isRead`: Whether the notification has been read by the user (optional).

**Usage:**
- Used to notify users of important events like likes, comments, shares, and mentions.

---

### 5. `userConnections` Table
The `userConnections` table manages the relationships between users, such as connection requests and statuses.

**Fields:**
- `userId`: The user who is initiating or receiving the connection.
- `connectionUserId`: The user who is being connected with.
- `status`: The status of the connection:
  - `pending`: Connection request is pending.
  - `accepted`: Connection request is accepted.
  - `rejected`: Connection request was rejected.
  - `blocked`: One user has blocked the other.
- `createdAt`: Timestamp when the connection status was set.

**Usage:**
- Manages user connections, connection requests, and blocks between users.

---

### 6. `userFollowings` Table
The `userFollowings` table tracks which users are following other users, without a mutual connection requirement.

**Fields:**
- `followedUserId`: The ID of the user being followed.
- `followedByUserId`: The ID of the user who is following.
- `followerRank`: A rank that can be calculated based on engagement metrics, user interaction, or influence (optional).

**Usage:**
- Allows users to follow others, keeping track of who follows whom, and helps in populating the user’s feed.

---

### 7. `postReactions` Table
The `postReactions` table stores individual reactions from users on specific posts. Each reaction is categorized by type.

**Fields:**
- `postId`: The post being reacted to.
- `userId`: The user reacting to the post.
- `reactionType`: The type of reaction, such as:
  - `like`
  - `celebrate`
  - `support`
  - `insightful`
  - `love`
  - `sad`
- `createdAt`: Timestamp when the reaction was made.

**Usage:**
- Manages individual reactions from users on posts, which are aggregated in the `posts` table.

---

### Summary
These tables together form the backbone of a social media-like platform, handling the creation, interaction, and display of posts, comments, feeds, and user connections. The structure is designed to be scalable, supporting a variety of post types (including shares), reactions, and dynamic feeds based on user engagement.

*/
