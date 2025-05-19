import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 p-10">
      <div>
        <Button variant="elevated">I am a button</Button>
      </div>
      <Input placeholder="I am an input" />
      <Progress value={50} />
      <Textarea placeholder="I am a textarea" />
      <Checkbox />
    </div>
  );
}
