module Util exposing (fromJust)


fromJust : Maybe a -> a
fromJust maybeA =
    case maybeA of
        Nothing ->
            Debug.crash "maybeA should always be Just."

        Just justA ->
            justA
