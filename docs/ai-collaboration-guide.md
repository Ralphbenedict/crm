# AI Collaboration Guide

This guide explains how to effectively collaborate with AI assistants (like Claude) when working on your CRM project, particularly when starting new milestones or features.

## Providing Context to AI Assistants

AI assistants work best when given comprehensive context. When starting a new milestone or feature, share these key documents:

### 1. Milestone Overview

Always start by sharing the milestone overview document. This provides the AI with:
- The big picture goals and timeline
- The specific features being developed
- Success criteria and priorities
- Technical considerations and constraints

**Example prompt:**
```
I'm starting work on the Order Management Enhancements milestone. Here's the milestone overview document:

[Paste milestone-overview.md content]

I need help with planning the technical architecture for this milestone.
```

### 2. Relevant PRDs

When working on a specific feature, share the PRD along with the milestone overview:

**Example prompt:**
```
I'm working on the Advanced Order Tracking feature from our Order Management Enhancements milestone. Here's the PRD:

[Paste order-tracking-prd.md content]

I need help breaking this down into user stories.
```

### 3. User Stories

When implementing a specific user story, provide both the user story and its parent PRD:

**Example prompt:**
```
I'm implementing this user story:

[Paste user-story.md content]

It's part of this PRD:

[Paste relevant-prd.md content]

I need help designing the database schema for this feature.
```

## Asking Effective Questions

When collaborating with AI assistants:

1. **Be specific about what you need**
   - Instead of: "Help me with this feature"
   - Try: "Help me design the API endpoints for the order tracking feature"

2. **Provide relevant constraints**
   - "We're using MongoDB and Express.js"
   - "This needs to be compatible with our existing customer model"
   - "We have performance requirements of handling 1000 orders per minute"

3. **Explain your current thinking**
   - "I'm considering approach A or B..."
   - "My current plan is..."
   - "I'm stuck on how to..."

4. **Request specific formats when needed**
   - "Please provide the response as a code snippet"
   - "Can you format this as a table comparing options?"
   - "Please structure this as step-by-step instructions"

## Example Scenarios

### Starting a New Milestone

```
I'm planning a new milestone for our CRM project focused on reporting and analytics. 
Here's our milestone template:

[Paste milestone-template.md]

Can you help me fill this out based on the following requirements?
- We need to create dashboards for sales performance
- We need to implement exportable reports
- We need to add data visualization for customer trends
- Timeline is August-September 2024
```

### Designing a Feature

```
I'm designing the Advanced Order Tracking feature described in this PRD:

[Paste order-tracking-prd.md]

Can you help me:
1. Design the state machine for order statuses
2. Plan the database schema changes needed
3. Outline the key API endpoints we'll need to implement
```

### Implementing a User Story

```
I'm implementing this user story:

[Paste user-story.md]

I've started coding the controller but I'm stuck on how to efficiently query the orders 
while applying the various filters. Our database is MongoDB and we're using Mongoose.
Can you help me optimize this query?
```

### Troubleshooting Issues

```
I'm working on the Order Analytics feature and encountering this error when aggregating order data:

[Paste error message]

Here's my current code:

[Paste code snippet]

And here's the relevant part of our data model:

[Paste model definition]

What might be causing this issue and how can I fix it?
```

## Best Practices for AI Collaboration

1. **Iterate on responses** - If the first response isn't quite right, clarify and ask for refinements
2. **Combine human and AI strengths** - Use AI for ideation, research, and first drafts; apply your domain knowledge to evaluate and refine
3. **Verify technical suggestions** - Always review and test code or technical suggestions before implementing
4. **Share feedback** - Let the AI know what worked and what didn't to improve future interactions
5. **Document insights** - Capture valuable insights from AI interactions in your project documentation

## Using AI Throughout the Project Lifecycle

| Phase | How AI Can Help |
|-------|----------------|
| Planning | Brainstorming features, drafting PRDs, estimating effort |
| Design | Suggesting architecture approaches, reviewing designs, identifying edge cases |
| Development | Writing code snippets, troubleshooting issues, optimizing algorithms |
| Testing | Generating test cases, reviewing test coverage, suggesting edge cases |
| Documentation | Drafting documentation, improving clarity, ensuring completeness |
| Review | Reviewing code, suggesting improvements, checking for best practices |

Remember that AI assistants are tools to enhance your work, not replace your expertise. The best results come from combining AI capabilities with your domain knowledge and critical thinking.
