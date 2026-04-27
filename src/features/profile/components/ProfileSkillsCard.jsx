import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'

export default function ProfileSkillsCard({ skills }) {
  return (
    <Card className="space-y-4">
      <div>
        <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Skills</p>
        <p className="landing-copy mt-2 text-xs text-[rgba(226,226,232,0.6)]">
          These tags help teammates find you based on technical strengths.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <Badge key={skill} variant="default">{skill}</Badge>
          ))
        ) : (
          <p className="landing-copy text-sm italic text-[rgba(226,226,232,0.4)]">No skills listed yet.</p>
        )}
      </div>
    </Card>
  )
}
