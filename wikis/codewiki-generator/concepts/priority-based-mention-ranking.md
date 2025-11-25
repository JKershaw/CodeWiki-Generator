---
title: Priority-based mention ranking
category: concept
sourceFile: lib/agents/link-discovery-agent.js
related: []
created: 2025-11-25
updated: 2025-11-25
---

# Priority-based mention ranking

## Purpose and Overview

Priority-based mention ranking is a conflict resolution system used within the automatic link discovery agent to handle overlapping text matches. When multiple match patterns detect the same text position, this ranking system ensures higher-confidence matches (like bold text) take precedence over lower-confidence ones (like plain text).

## Key Functionality

The ranking system implements a two-tier priority scheme:

- **Priority 1**: Bold text mentions - These are considered high-confidence matches since bold formatting often indicates important terms or concepts worth linking
- **Priority 2**: Plain text mentions - Standard text matches that fall within word boundaries but lack special formatting

When the link discovery process identifies overlapping matches at the same text position, the system automatically selects the match with the higher priority (lower numerical value). This prevents duplicate link suggestions and ensures the most semantically meaningful matches are preserved.

The ranking works in conjunction with markup-aware text analysis to avoid suggesting links within existing markdown formatting, maintaining content integrity while maximizing useful cross-page connections.

## Relationships

This concept is tightly integrated with several other components in the link discovery system:

- **Automatic link discovery and suggestion system** - Provides the core framework where priority ranking operates
- **Markup-aware text analysis** - Works together to filter out inappropriate match locations before ranking is applied  
- **Related pages inference** - Benefits from the improved match quality that priority ranking provides, leading to more accurate page relationship detection

The priority system acts as a quality filter in the link discovery pipeline, sitting between initial pattern matching and final link suggestion generation.

## Usage Example

No usage examples available - see source code for implementation details. The priority-based ranking operates internally within the link discovery agent's matching algorithms and is not directly exposed as a standalone API.

## Testing

No automated tests found for this component.