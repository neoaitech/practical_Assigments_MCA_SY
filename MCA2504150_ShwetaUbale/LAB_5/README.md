You used bat, which tells Jenkins to run a Windows command.

However, your Jenkins server is actually running inside Linux (such as a Docker container). Linux doesn't understand Windows commands, so it failed.

To fix it, you need to use sh instead of bat, which tells Jenkins to run a Linux command.