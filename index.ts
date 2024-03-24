import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env["ANTHROPIC_API_KEY"], // This is the default and can be omitted
});

const TEXT_TO_TRANSLATE = `
Stable Diffusion AI is a latent diffusion model for generating AI images. The images can be photorealistic, like those captured by a camera, or in an artistic style as if produced by a professional artist.
                  The best part is that it is free – you can run it on your PC.
                  How to use Stable Diffusion?
                  You need to give it a prompt that describes an image. For example:
                  gingerbread house, diorama, in focus, white background, toast , crunch cereal
                  Stable Diffusion turns this prompt into images like the ones below.
                  You can generate as many variations as you want from the same prompt.

                  What’s the advantage of Stable Diffusion?
                  There are similar text-to-image generation services like DALLE and MidJourney. Why Stable Diffusion? The advantages of Stable Diffusion AI are

                  Open-source: Many enthusiasts have created free tools and models.
                  Designed for low-power computers: It’s free or cheap to run.
                  Is Stable Diffusion AI Free?
                  Stable Diffusion is free to use when running on your own Windows or Mac machines. An online service will likely cost you a modest fee because someone needs to provide you with the hardware to run on.

                  What Can Stable Diffusion Do?
                  1. Generate images from text
                  The most basic usage of Stable Diffusion is text-to-image (txt2img). Here are some examples of images you can generate with Stable Diffusion.

                  Anime style


                  Stable Diffusion beginner's guide
                  Photorealistic style



                  Learn how to generate realistic people and realistic street humans.

                  Landscape

                  Fantasy

                  realistic princess.

                  Artistic style

                  Animals
                  Learn how to generate animals.


                  Take out the guesswork for becoming an AI artist. Learn Stable Diffusion step-by-step.

                  Get the Beginner’s Guide
                  2. Generate an image from another image
                  Image-to-image (img2img) transforms one image to another using Stable Diffusion AI.

                  Below is an example of transforming my drawing of an apple into a photo-realistic one. (Tutorial)
`;

const TERMS = [
  "Stable Diffusion",
  "SD model",
  "Diffuser",
  "LLM",
  "token",
  "tokenizer",
  "inference",
  "Runpod",
];

const TERMS_VIETNAMESE_MAP = {
  txt2img: "tạo hình từ ảnh",
  img2img: "tạo hình từ hình",
  inpainting: "vẽ đè",
  outpainting: "vẽ thêm",
};

const systemPrompt = `Act as an English translator and technical writer to help me write my course material in Vietnamese.
I will speak to you in English and you will translate and improve my text, in Vietnamese.

Translation Note:
- Try to make it friendly and as easy to udnerstand as possible. Add explanations if needed.
- Only reply the translation and nothing else, do not write explanations.
- Do not remove or merge sentences, try to keep the number of sentences the same. Separate each sentence with a new line.

Terminologies:
- Keep these terms in English: ${TERMS.join(", ")}.
- Translate these terms into Vietnamsese:
\`\`\`
${Object.entries(TERMS_VIETNAMESE_MAP)
  .map(([key, value]) => `"${key}"="${value}"`)
  .join("\n")}
\`\`\`

Output format: Format the translation in markdown format.
`;

async function* callClaude(input: string) {
  const stream = await anthropic.messages.create({
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: input }],
    temperature: 0.5,
    model: "claude-3-opus-20240229",
    stream: true,
  });

  for await (const messageStreamEvent of stream) {
    if (messageStreamEvent.type === "content_block_delta") {
      yield messageStreamEvent.delta.text;
    } else if (messageStreamEvent.type === "content_block_start") {
      yield messageStreamEvent.content_block.text;
    }
  }
}

// cleanup the input, remove empty line and extra spaces then join
const input = TEXT_TO_TRANSLATE.split("\n")
  .map((line) => line.trim())
  .filter((line) => line)
  .join("\n");

const steam = await callClaude(input);
for await (const message of steam) {
  process.stdout.write(message);
}
