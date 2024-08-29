if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[경고] ${filePath} 파일의 명령어에 "data" 또는 "execute" 속성이 없습니다.`);
    }