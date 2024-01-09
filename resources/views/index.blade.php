<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT Layout</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .chat-container {
            display: flex;
            height: 100vh;
        }

        .sidebar {
            width: 20%;
            background-color: #333;
            color: white;
            padding: 20px;
        }

        .chat-body {
            flex-grow: 1;
            background-color: #fff;
            overflow-y: auto;
            padding: 20px;
        }

        .input-area {
            background-color: #fff;
            padding: 20px;
            border-top: 1px solid #ddd;
        }

        .input-area input {
            width: 100%;
            padding: 10px;
            border: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <!-- Sidebar -->
        <div class="sidebar">
            <h2>Sidebar</h2>
            <!-- Sidebar content goes here -->
        </div>

        <!-- Chat Body -->
        <div class="chat-body">
            <h2>Chat Body</h2>
            <!-- Chat messages and conversation go here -->
            <div class="message">
                <p>User: Hello, how can I help you?</p>
            </div>
            <div class="message">
                <p>ChatGPT: Hi! I'm here to assist you.</p>
            </div>
            <!-- Add more messages as needed -->
        </div>
    </div>

    <!-- Input Area -->
    <div class="input-area">
        <input type="text" placeholder="Type your message...">
        <!-- Send button or other controls can go here -->
    </div>
</body>
</html>
