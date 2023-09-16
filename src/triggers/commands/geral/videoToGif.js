import fs from "fs";
import { resolve } from "path";
import axios from "axios";
import { exec } from "child_process";

import Trigger from "../../../structures/Trigger.js";
import { EmbedBuilder } from "@discordjs/builders";

export default class extends Trigger {
  constructor(client) {
    super(client, {
      name: "gif",
      description: "Transformar vídeo em um gif.",
      options: [
        {
          name: "vídeo",
          description: "O vídeo que deseja transformar em gif.",
          type: 11,
          required: true,
        },
      ],
    });
  }

  run = async (interaction) => {
    const video = interaction.options.getAttachment("vídeo");

    if (video.size > 10_000_000)
      return interaction.reply({
        content: "O vídeo deve ter no máximo 10MB.",
        ephemeral: true,
      });

    if (video.contentType !== "video/mp4")
      return interaction.reply({
        content: "O vídeo deve ser no formato mp4.",
        ephemeral: true,
      });

    const url = video.attachment;

    await interaction.reply({
      content: "Baixando vídeo...",
      ephemeral: true,
    });

    const now = Date.now();
    const videoPath = resolve(process.cwd(), "cache", `${now}.mp4`);
    const gifPath = resolve(process.cwd(), "cache", `${now}.gif`);
    const palettePath = resolve(process.cwd(), "cache", `${now}.png`);

    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    response.data.pipe(fs.createWriteStream(videoPath));

    response.data.on("end", async () => {
      const msg = interaction.editReply({
        content: "Obtendo paleta de cores...",
      });

      exec(
        `ffmpeg -ss 0 -t 5 -i ${videoPath} -filter_complex "[0:v] palettegen" ${palettePath}`,
        (error) => {
          if (error) {
            console.error(error);
            interaction.editReply({
              content: "Ocorreu um erro ao tentar obter a paleta de cores.",
            });
            deleteFiles([videoPath, gifPath, palettePath]);
          } else {
            interaction.editReply({
              content: "Transformando vídeo em GIF...",
            });

            exec(
              `ffmpeg -ss 0 -i ${videoPath} -i ${palettePath} -filter_complex "[0:v] fps=10,scale=600:-1 [new];[new][1:v] paletteuse" -fs 8M ${gifPath}`,
              async (error) => {
                if (error) {
                  console.error(error);
                  interaction.editReply({
                    content:
                      "Ocorreu um erro ao tentar converter o vídeo em GIF.",
                  });
                } else {
                  await interaction
                    .editReply({
                      content: interaction.user.toString(),                      
                      files: [
                        {
                          name: "video.gif",
                          attachment: gifPath,
                        },
                      ],
                      embeds: [
                        new EmbedBuilder({
                          title: "Vídeo convertido com sucesso!",
                          description: "Aqui está o seu GIF:",
                          color: 0x00ff00,
                          image: {
                            url: `attachment://video.gif`,
                          },
                        }),
                      ],
                    })
                    .catch(console.error);
                }
                deleteFiles([videoPath, gifPath, palettePath]);
              }
            );
          }
        }
      );
    });

    response.data.on("error", (err) => {
      console.error(err);
      interaction.editReply({
        content: "Ocorreu um erro ao baixar o vídeo.",
      });
    });
  };
}

function deleteFiles(files) {
  files.forEach((file) => {
    if (fs.existsSync(file))
      fs.unlink(file, (err) => {
        if (err) console.error(err);
      });
  });
}
