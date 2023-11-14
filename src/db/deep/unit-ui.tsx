async ({ deep, require }) => {
  const React = require('react');
  const { useState, useEffect } = React;
  const { Box, Text, Avatar, Wrap, WrapItem, Editable, EditablePreview, EditableInput, EditableTextarea, Center, Flex, Divider, Button } = require('@chakra-ui/react');
  const AsyncFileId = await deep.idLocal("@deep-foundation/core", "AsyncFile");
  var UnitNameId = await deep.id("@suenot/unit", "Name");
  var UnitDescriptionId = await deep.id("@suenot/unit", "Description");
  var UnitTickerId = await deep.id("@suenot/unit", "Ticker");
  var UnitAvatarId = await deep.id("@suenot/unit", "Avatar");
  
  return ({ fillSize, style, link }) => {

    const data = deep.useDeepSubscription({
        _or: [
          {
            to_id: link.id,
            type_id: { _id: ["@deep-foundation/core", "AsyncFile"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/unit", "Name"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/unit", "Description"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/unit", "Ticker"] }
          },
          {
            to_id: link.id,
            type_id: { _id: ["@suenot/unit", "Avatar"] }
          }
        ]
      }
    );
    const fileData = deep.minilinks.query({
      to_id: link.id,
      type_id: AsyncFileId
    });
    const nameData = deep.minilinks.query({
      to_id: link.id,
      type_id: UnitNameId
    });
    const unitDescriptionData = deep.minilinks.query({
      to_id: link.id,
      type_id: UnitDescriptionId
    });
    const tickerData = deep.minilinks.query({
      to_id: link.id,
      type_id: UnitTickerId
    });
    const avatarData = deep.minilinks.query({
      to_id: link.id,
      type_id: UnitAvatarId
    });



    var unitFileValue = fileData?.[0]?.id && `/api/file?linkId=${fileData?.[0]?.id}`;
    var unitAvatarValue = avatarData?.[0]?.value?.value || "";
    var unitAvatarId = avatarData?.[0]?.id;
    // File has more priority than avatar (url)
    var unitSrcValue = unitFileValue || unitAvatarValue || "";

    var unitNameValue = nameData?.[0]?.value?.value || '';
    var unitNameId = nameData?.[0]?.id;
    var unitTickerValue = tickerData?.[0]?.value?.value || '';
    var unitTickerId = tickerData?.[0]?.id;
    var unitDescriptionValue = unitDescriptionData?.[0]?.value?.value || "";
    var unitDescriptionId = unitDescriptionData?.[0]?.id;
    console.log({data});

    const [unitName, setUnitName] = useState(unitNameValue);
    const [unitTicker, setUnitTicker] = useState(unitTickerValue);
    const [unitDescription, setUnitDescription] = useState(unitDescriptionValue);
    const [unitFile, setUnitFile] = useState(unitFileValue);
    const [unitAvatar, setUnitAvatar] = useState(unitAvatarValue);
    const [unitSrc, setUnitSrc] = useState(unitSrcValue);

    return <div>
      <Box maxW='sm' minW='sm' w='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='4' backgroundColor='white'>
        <div>
          <Flex
            align="center"
            justify="center"
          >
            <Avatar size='2xl' name='' src={unitSrc} mb='1' />
          </Flex>
        </div>
        <Editable placeholder="Insert name" value={unitName} onChange={async (value) => {
          setUnitName(value)
        }}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
        <Editable placeholder="Insert ticker" value={unitTicker} onChange={async (value) => {
          setUnitTicker(value)
        }}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
        <Editable placeholder="Insert description" value={unitDescription} onChange={async (value) => {
          setUnitDescription(value)
        }}>
          <EditablePreview w={'100%'} />
          <EditableTextarea />
        </Editable>
        <Divider />
        <Editable placeholder="Insert avatar url" value={unitAvatar} onChange={async (value) => {
          setUnitAvatar(value);
          const newSrc = unitFile || value || "";
          setUnitSrc(newSrc);
        }}>
          <EditablePreview w={'100%'} />
          <EditableInput />
        </Editable>
        <Button colorScheme='teal' size='md' variant='outline' onClick={async () => {
          if (unitName === undefined) setUnitName("");
          if (unitDescription === undefined) setUnitDescription("");
          if (unitTicker === undefined) setUnitTicker("");
          if (unitAvatar === undefined || unitAvatar === null) setUnitAvatar("");

          if (!unitNameId) {
            console.log("Unit doesn't exist")
            const { data: [{ id: _unitNameId }] } = await deep.insert({
              type_id: UnitNameId,
              from_id: link.id,
              to_id: link.id,
              string: { data: { value: unitName } },
            })
            unitNameId = _unitNameId;
          } else {
            console.log("Unit exist", {unitNameId, UnitNameId, unitName})
            const { data: [{ link: _unitNameId }] } = await deep.update(
              { link_id: unitNameId },
              { value: unitName },
              { table: 'strings', returning: `link { ${deep.selectReturning} }` }
            );
            console.log({_unitNameId});
          }

          if (!unitDescriptionId) {
            console.log("Description doesn't exist")
            const { data: [{ id: _unitDescriptionId }] } = await deep.insert({
              type_id: UnitDescriptionId,
              from_id: link.id,
              to_id: link.id,
              string: { data: { value: unitDescription } },
            })
            unitDescriptionId = _unitDescriptionId;
          } else {
            console.log("Description exist")
            const { data: [{ link: _unitDescriptionId }] } = await deep.update(
              { link_id: unitDescriptionId },
              { value: unitDescription },
              { table: 'strings', returning: `link { ${deep.selectReturning} }` }
            );
            console.log({_unitDescriptionId});
          }

          if (!unitTickerId) {
            const { data: [{ id: _unitTickerId }] } = await deep.insert({
              type_id: UnitTickerId,
              from_id: link.id,
              to_id: link.id,
              string: { data: { value: unitTicker } },
            })
            unitTickerId = _unitTickerId;
          } else {
            const { data: [{ link: _unitTickerId }] } = await deep.update(
              { link_id: unitTickerId },
              { value: unitTicker },
              { table: 'strings', returning: `link { ${deep.selectReturning} }` }
            );
          }

          if (!unitAvatarId) {
            const { data: [{ id: _unitAvatarId }] } = await deep.insert({
              type_id: UnitAvatarId,
              from_id: link.id,
              to_id: link.id,
              string: { data: { value: unitAvatar } },
            })
            unitAvatarId = _unitAvatarId;
          } else {
            const { data: [{ link: _unitAvatarId }] } = await deep.update(
              { link_id: unitAvatarId },
              { value: unitAvatar },
              { table: 'strings', returning: `link { ${deep.selectReturning} }` }
            );
          }
        }}>
          Save
        </Button>
      </Box>
    </div>;
  }
}